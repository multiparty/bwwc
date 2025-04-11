# RDS Password
resource "random_password" "bwwc_db_password" {
  length  = 20
  special = true
  override_special = "!#$%^&*()-_=+[]{}<>?"
  min_special = 0
}

# AWS Secrets Manager Secret for RDS Password
# Creates a secret in AWS Secrets Manager to store the generated RDS password.
resource "aws_secretsmanager_secret" "bwwc_db_password_secret" {
  name = "bwwc-db-password4"
}

# AWS Secrets Manager Secret Version for RDS Password
# Stores the generated password (from Secrets Manager) as a secret version.
resource "aws_secretsmanager_secret_version" "db_password_secret_value" {
  secret_id = aws_secretsmanager_secret.bwwc_db_password_secret.id
  secret_string = jsonencode({
    password = random_password.bwwc_db_password.result
  })
}

# RDS Subnet Group
resource "aws_db_subnet_group" "bwwc_db_subnet_group" {
  name        = "bwwc-db-subnet-group"
  description = "Subnet group for bwwc API RDS Cluster"
  subnet_ids  = var.private_subnet_ids
}

# RDS Security Group
# Configures the security group for the RDS cluster, allowing access from specific sources and port.
resource "aws_security_group" "bwwc_rds_sg" {
  name        = "bwwc-rds-sg"
  description = "Security Group for bwwc API RDS Cluster"
  vpc_id      = var.vpc_id

  # Ingress rule to allow TCP traffic on port 5432 (default for PostgreSQL) from the VPC CIDR block
  ingress {
    from_port = 5432
    to_port   = 5432
    protocol  = "tcp"
    cidr_blocks = ["10.0.0.0/16"] # VPC CIDR block to allow access from
  }

  # Egress rule allowing all outbound traffic
  egress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    cidr_blocks = ["0.0.0.0/0"] # Allows access to any external address
  }
}

# RDS Cluster
# Creates the RDS Aurora PostgreSQL cluster with various configurations.
resource "aws_rds_cluster" "bwwc_db" {
  enabled_cloudwatch_logs_exports  = ["postgresql"]
  engine_mode                      = "provisioned"
  deletion_protection              = true
  cluster_identifier    = "bwwc-postgres"
  engine                = "aurora-postgresql"
  apply_immediately     = true
  skip_final_snapshot   = true
  enable_http_endpoint  = true
  engine_version        = "16.4"
  database_name         = "bwwc"
  master_username       = "bwwc"

  # Password retrieved from Secrets Manager
  master_password       = jsondecode(aws_secretsmanager_secret_version.db_password_secret_value.secret_string).password

  db_subnet_group_name  = aws_db_subnet_group.bwwc_db_subnet_group.name
  vpc_security_group_ids = [aws_security_group.bwwc_rds_sg.id]
  serverlessv2_scaling_configuration {
    max_capacity = 1
    min_capacity = 0.5
  }
  allow_major_version_upgrade = true
  storage_encrypted = true
}

# RDS Cluster Instance (Writer)
# Creates a cluster instance that can become a writer for the Aurora cluster.
resource "aws_rds_cluster_instance" "writer" {
  count = 1
  # Setting promotion tier to 0 makes the instance eligible to become a writer.
  promotion_tier                  = 0
  cluster_identifier              = aws_rds_cluster.bwwc_db.cluster_identifier
  identifier_prefix               = "${aws_rds_cluster.bwwc_db.cluster_identifier}-"
  instance_class                  = "db.serverless"
  engine                          = aws_rds_cluster.bwwc_db.engine
  engine_version                  = aws_rds_cluster.bwwc_db.engine_version
  db_subnet_group_name            = aws_db_subnet_group.bwwc_db_subnet_group.name
  depends_on                      = [aws_rds_cluster.bwwc_db]
}

# RDS Cluster Instance (Reader)
# Creates a cluster instance that acts as a reader and cannot be promoted to writer.
resource "aws_rds_cluster_instance" "reader" {
  count = 1
  # Any promotion tier above 1 is a reader, and cannot become a writer.
  # If the cluster comes up with a reader instance as the writer, initiate a failover.
  promotion_tier                  = 2
  cluster_identifier              = aws_rds_cluster.bwwc_db.cluster_identifier
  identifier_prefix               = "${aws_rds_cluster.bwwc_db.cluster_identifier}-"
  instance_class                  = "db.serverless"
  engine                          = aws_rds_cluster.bwwc_db.engine
  engine_version                  = aws_rds_cluster.bwwc_db.engine_version
  db_subnet_group_name            = aws_db_subnet_group.bwwc_db_subnet_group.name
  depends_on                      = [aws_rds_cluster.bwwc_db]
}