output "database_url" {
  value = "postgresql://bwwc:${jsondecode(aws_secretsmanager_secret_version.db_password_secret_value.secret_string).password}@${aws_rds_cluster.bwwc_db.endpoint}:5432/bwwc"
  sensitive = true
}

output "rds_host" {
  description = "The endpoint of the RDS database"
  value       = aws_rds_cluster.bwwc_db.endpoint
}

output "rds_username" {
  description = "The master username for the RDS database"
  value       = aws_rds_cluster.bwwc_db.master_username
}

output "rds_password" {
  description = "The master password for the RDS database"
  value       = aws_secretsmanager_secret.bwwc_db_password_secret.arn
  sensitive   = true  
}

output "rds_database" {
  description = "The name of the RDS database"
  value       = aws_rds_cluster.bwwc_db.database_name
}