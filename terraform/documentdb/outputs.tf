output "mongo_host" {
  description = "The host (endpoint) of the MongoDB DocumentDB Cluster"
  value       = aws_docdb_cluster.bwwc_documentdb.endpoint
}

output "mongo_password" {
  description = "DocumentDB password retrieved from Secrets Manager"
  value       = aws_secretsmanager_secret.bwwc_documentdb_password_secret.arn
  sensitive   = true
}

output "mongo_uri" {
  value = "mongodb://bwwc:${jsondecode(aws_secretsmanager_secret_version.documentdb_password_secret_value.secret_string).password}@${aws_docdb_cluster.bwwc_documentdb.endpoint}:27017/?retryWrites=false"
  sensitive = true
}