
variable "vpc_cidr" {
	type = "string"
}

variable "aws_access_key" {
	type = "string"
}

variable "aws_secret_key" {
	type = "string"
}

variable "aws_region" {
	type = "string"
}

variable "keyname" {
	type = "string"
	default = ""
}

// This is used in hostnames/FQDNs
variable "appname" {
	type = "string"
}
