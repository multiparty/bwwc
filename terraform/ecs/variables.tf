variable "vpc_id" {
  description = "ID of the VPC where ECS resources will be deployed"
  type = string
}

variable "private_subnet_ids" {
  description = "List of subnet IDs for ECS services"
  type        = list(string)
}

variable "public_subnet_ids" {
  description = "List of public subnet IDs for ECS services"
  type        = list(string)
}

variable "postgres_username" {
  description = "The username for the RDS database"
  type        = string
  default     = "bwwc"  # You can change this if needed
}

variable "postgres_password" {
  description = "The password for the RDS database"
  type        = string
  sensitive   = true
}

variable "postgres_database" {
  description = "The database name for the RDS instance"
  type        = string
  default     = "bwwc"
}

variable "postgres_host" {
  description = "The host endpoint for the RDS database"
  type        = string
}

variable "mongo_uri" {
  description = "mongo database uri"
  type = string
}