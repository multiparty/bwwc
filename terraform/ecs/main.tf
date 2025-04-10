provider "aws" {
  region = "us-east-1"
}

resource "aws_ecs_cluster" "bwwc_cluster" {
  name = "bwwc-cluster"
}

resource "aws_cloudwatch_log_group" "ecs_log_group_backend" {
  name              = "/ecs/bwwc-backend"
  retention_in_days = 14
}

resource "aws_iam_policy" "cloudwatch_logs_policy" {
  name        = "ecs-cloudwatch-logs-policy"
  description = "Policy to allow ECS tasks to write logs to CloudWatch"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Resource = [
          "${aws_cloudwatch_log_group.ecs_log_group_backend.arn}:*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "cloudwatch_logs_policy_attachment" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.cloudwatch_logs_policy.arn
}


resource "aws_ecs_task_definition" "backend" {
  family                   = "bwwc-backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  runtime_platform {
    cpu_architecture = "X86_64"
  }

  container_definitions = jsonencode([
    {
      name      = "bwwc-backend",
      image     = "multiparty/bwwc-backend:main",
      memory    = 512,
      cpu       = 256,
      essential = true,
      portMappings = [{ containerPort = 8000, hostPort = 8000 }],
      healthCheck = {
        command     = ["CMD-SHELL", "wget -q -O - http://localhost:8000/api/bwwc/healthz || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      },
      environment = [
        { name = "SECRET_KEY", value = "django-insecure-x$ee)y$zn8!egy6(9olf6maf2tt0%wtn&qd_qzlo_v9f_-!5)@" },
        { name = "BASE_URL", value = "http://${aws_lb.bwwc_lb.dns_name}" },
        { name = "PRIME", value = "180252380737439" },
        { name = "THRESHOLD", value = "3" },
        { name = "POSTGRES_HOST", value = var.postgres_host },
        { name = "POSTGRES_USERNAME", value = var.postgres_username },
        { name = "POSTGRES_DATABASE", value = var.postgres_database },
        { name = "POSTGRES_PORT", value = "5432" },
        { name = "MONGO_URI", value = var.mongo_uri },
        { name = "DJANGO_ALLOWED_HOSTS", value = "${aws_lb.bwwc_lb.dns_name},localhost,127.0.0.1" },
        { name = "ALLOW_ALL_HOSTS", value = "true" }
      ],
      secrets = [
        { name = "POSTGRES_PASSWORD", valueFrom = "${var.postgres_password}:password::" }  
      ],
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.ecs_log_group_backend.name
          "awslogs-region"        = "us-east-1"
          "awslogs-stream-prefix" = "bwwc-backend"
        }
      }      
    }
  ])
}

resource "aws_ecs_service" "backend" {
  name            = "bwwc-backend-service"
  cluster         = aws_ecs_cluster.bwwc_cluster.id
  task_definition = aws_ecs_task_definition.backend.arn
  launch_type     = "FARGATE"
  desired_count   = 1
  
  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [aws_security_group.fargate_sg.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend.arn
    container_name   = "bwwc-backend"
    container_port   = 8000
  }

  health_check_grace_period_seconds = 60
}

resource "aws_security_group" "lb_sg" {
  name        = "lb-sg"
  description = "Security group for the ALB"
  vpc_id      = var.vpc_id

  ingress {
    description = "Allow HTTP traffic"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow HTTPS traffic"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Allow traffic from anywhere
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "fargate_sg" {
  name        = "fargate-sg"
  description = "Allow inbound traffic to backend only from ALB"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    security_groups = [aws_security_group.lb_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_lb" "bwwc_lb" {
  name               = "bwwc-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.lb_sg.id]
  subnets            = var.public_subnet_ids
}

resource "aws_lb_target_group" "backend" {
  name        = "bwwc-backend-tg"
  port        = 8000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    path                = "/api/bwwc/healthz" 
    interval            = 30        
    timeout             = 5         
    healthy_threshold   = 2        
    unhealthy_threshold = 2        
    matcher             = "200"     
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_lb_listener" "backend" {
  load_balancer_arn = aws_lb.bwwc_lb.arn
  port             = 80
  protocol         = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }
}

resource "aws_iam_policy" "secrets_access" {
  name        = "ECSSecretsAccess"
  description = "Allow ECS tasks to retrieve secrets from AWS Secrets Manager"
  policy      = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = ["secretsmanager:GetSecretValue"],
        Resource = "arn:aws:secretsmanager:us-east-1:135854645631:secret:*"
      }
    ]
  })
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name = "ecsTaskExecutionRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "ecs_task_secrets" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.secrets_access.arn
}