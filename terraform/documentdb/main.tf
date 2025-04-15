# DocumentDB Password
resource "random_password" "bwwc_documentdb_password" {
  length      = 20
  special     = false
  min_special = 0
}


# Store the generated password in AWS Secrets Manager
resource "aws_secretsmanager_secret" "bwwc_documentdb_password_secret" {
  name = "bwwc-documentdb-password"
}

# Save the secret value as a new version in Secrets Manager
resource "aws_secretsmanager_secret_version" "documentdb_password_secret_value" {
  secret_id = aws_secretsmanager_secret.bwwc_documentdb_password_secret.id
  secret_string = jsonencode({
    password = random_password.bwwc_documentdb_password.result
  })
}

# DocumentDB Subnet Group
resource "aws_docdb_subnet_group" "bwwc_documentdb_subnet_group" {
  name        = "bwwc-documentdb-subnet-group"
  description = "Subnet group for bwwc API DocumentDB Cluster"
  subnet_ids  = var.private_subnet_ids
}

# DocumentDB Security Group
resource "aws_security_group" "bwwc_documentdb_sg" {
  name        = "bwwc-documentdb-sg"
  description = "Security Group for bwwc API DocumentDB Cluster"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# DocumentDB Cluster
resource "aws_docdb_cluster" "bwwc_documentdb" {
  enabled_cloudwatch_logs_exports = ["audit"]
  deletion_protection             = true
  cluster_identifier              = "bwwc-documentdb"
  engine                          = "docdb"
  apply_immediately               = true
  skip_final_snapshot             = true
  engine_version                  = "5.0.0"
  master_username                 = "bwwc"

  # Use password stored in Secrets Manager
  master_password                 = jsondecode(aws_secretsmanager_secret_version.documentdb_password_secret_value.secret_string).password
  
  db_subnet_group_name            = aws_docdb_subnet_group.bwwc_documentdb_subnet_group.name
  vpc_security_group_ids          = [aws_security_group.bwwc_documentdb_sg.id]
  allow_major_version_upgrade     = true
  storage_encrypted               = true
  db_cluster_parameter_group_name = aws_docdb_cluster_parameter_group.bwwc_group.name
}

# Cluster instances
resource "aws_docdb_cluster_instance" "bwwc_documentdb" {
  count = 2
  # Setting promotion tier to 0 makes the instance eligible to become a writer.
  promotion_tier     = 0
  cluster_identifier = aws_docdb_cluster.bwwc_documentdb.cluster_identifier
  identifier_prefix  = "${aws_docdb_cluster.bwwc_documentdb.cluster_identifier}-"
  instance_class     = "db.t3.medium"
  engine             = aws_docdb_cluster.bwwc_documentdb.engine
  depends_on         = [aws_docdb_cluster.bwwc_documentdb]
}

# Custom DocumentDB group for custom settings
resource "aws_docdb_cluster_parameter_group" "bwwc_group" {
  family      = "docdb5.0"
  name        = "bwwc-param-group"
  description = "docdb cluster parameter group"

  parameter {
    name  = "tls"
    value = "disabled"
  }
}