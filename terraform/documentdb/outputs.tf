output "mongo_host" {
  description = "The host (endpoint) of the MongoDB DocumentDB Cluster"
  value       = aws_docdb_cluster.bwwc_documentdb.endpoint
}