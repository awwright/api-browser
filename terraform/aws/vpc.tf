
resource "aws_vpc" "main" {
  cidr_block       = "${var.vpc_cidr}"
  //instance_tenancy = "dedicated"
  instance_tenancy = "default"

  tags {
    Name = "JSON Schema Browser"
  }
}

data "aws_subnet_ids" "public" {
  vpc_id = "${aws_vpc.main.id}"
  tags {
    "Subnet Realm" = "Public"
  }
}

