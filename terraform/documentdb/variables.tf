variable "vpc_id" {
  description = "ID of the VPC where ECS resources will be deployed"
  type = string
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs for ECS services"
  type        = list(string)
}