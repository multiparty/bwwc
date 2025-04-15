output "redis_host" {
  value = aws_elasticache_cluster.bwwc_redis.cache_nodes[0].address
}

output "redis_url" {
  value = aws_elasticache_cluster.bwwc_redis.configuration_endpoint
}