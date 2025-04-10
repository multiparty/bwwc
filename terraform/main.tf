terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.54.1"
    }
  }

  backend "s3" {
    bucket         = "bwwc-terraform-state"
    key            = "bwwc/terraform.tfstate"
    region         = "us-east-2"
    encrypt        = true
  }
}

provider "aws" {
  region = "us-east-1"
  default_tags {
    tags = {
      "Project" = "bwwc"
    }
  }
}

module "documentdb" {
  source             = "./documentdb/"
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
}

module "ecs" {
  source = "./ecs"
  vpc_id = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  public_subnet_ids = module.vpc.public_subnet_ids
  postgres_username = module.rds.rds_username
  postgres_password = module.rds.rds_password
  postgres_host = module.rds.rds_host
  postgres_database = module.rds.rds_database
  mongo_host = module.documentdb.mongo_host
  mongo_password = module.documentdb.mongo_password
  mongo_uri =  module.documentdb.mongo_uri
}

module "rds" {
  source = "./rds"
  vpc_id = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
}

module "redis" {
  source = "./redis"
  vpc_id = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
}

module "vpc" {
  source = "./vpc"
}