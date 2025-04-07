resource "aws_vpc" "bwwc_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "bwwc_vpc"
  }
}

resource "aws_subnet" "bwwc_public_subnet" {
  count                   = 2
  vpc_id                  = aws_vpc.bwwc_vpc.id
  cidr_block              = cidrsubnet(aws_vpc.bwwc_vpc.cidr_block, 4, count.index)
  map_public_ip_on_launch = true
  availability_zone       = element(["us-east-1a", "us-east-1b"], count.index)
  tags = {
    Name = "bwwc_public_subnet_${count.index}"
  }
}

resource "aws_subnet" "bwwc_private_subnet" {
  count                   = 2
  vpc_id                  = aws_vpc.bwwc_vpc.id
  cidr_block              = cidrsubnet(aws_vpc.bwwc_vpc.cidr_block, 4, count.index + 2)
  map_public_ip_on_launch = false
  availability_zone       = element(["us-east-1a", "us-east-1b"], count.index)
  tags = {
    Name = "bwwc_private_subnet_${count.index}"
  }
}

resource "aws_internet_gateway" "main_gw" {
  vpc_id = aws_vpc.bwwc_vpc.id
  tags = {
    Name = "bwwc_igw"
  }
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.bwwc_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main_gw.id
  }
  tags = {
    Name = "bwwc_public_rt"
  }
}

resource "aws_route_table_association" "public_rt_assoc" {
  count          = length(aws_subnet.bwwc_public_subnet)
  subnet_id      = aws_subnet.bwwc_public_subnet[count.index].id
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_eip" "nat_eip" {
  count  = 2
  domain = "vpc"
  tags = {
    Name = "bwwc_nat_eip_${count.index}"
  }
}

resource "aws_nat_gateway" "nat_gateway" {
  count         = 2
  allocation_id = aws_eip.nat_eip[count.index].id
  subnet_id     = aws_subnet.bwwc_public_subnet[count.index].id
  tags = {
    Name = "bwwc_nat_gw_${count.index}"
  }
}

resource "aws_route_table" "private_rt" {
  count  = 2
  vpc_id = aws_vpc.bwwc_vpc.id
  tags = {
    Name = "bwwc_private_rt_${count.index}"
  }
}

resource "aws_route" "private_nat_route" {
  count                  = 2
  route_table_id         = aws_route_table.private_rt[count.index].id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.nat_gateway[count.index].id
}

resource "aws_route_table_association" "private_subnet_association" {
  count          = length(aws_subnet.bwwc_private_subnet)
  subnet_id      = aws_subnet.bwwc_private_subnet[count.index].id
  route_table_id = aws_route_table.private_rt[count.index].id
}