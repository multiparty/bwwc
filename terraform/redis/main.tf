resource "aws_security_group" "bwwc_redis_sg" {
  name        = "bwwc-redis-sg"
  description = "Security Group for bwwc API Redis"
  vpc_id = var.vpc_id


  ingress {
    from_port   = 6379
    to_port     = 6379
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

# Redis Subnet Group
resource "aws_elasticache_subnet_group" "bwwc_redis_subnet_group" {
  name        = "bwwc-api-redis-subnet-group"
  description = "Subnet group for bwwc API Redis Cluster"
  subnet_ids  = var.private_subnet_ids
}

resource "aws_elasticache_cluster" "bwwc_redis" {
  cluster_id           = "bwwc-api-redis"
  engine               = "redis"
  node_type            = "cache.t2.micro"
  num_cache_nodes      = 1
  engine_version       = "6.x"
  security_group_ids = [aws_security_group.bwwc_redis_sg.id]
  subnet_group_name = aws_elasticache_subnet_group.bwwc_redis_subnet_group.name
}