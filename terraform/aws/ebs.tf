
resource "aws_elastic_beanstalk_application" "app" {
	name        = "api-browser"
	description = "Description"
}

resource "aws_elastic_beanstalk_environment" "env" {
	name                = "${var.appname}"
	application         = "${aws_elastic_beanstalk_application.app.name}"
	solution_stack_name = "64bit Amazon Linux 2017.09 v4.4.4 running Node.js"

	// List of settings:
	// https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options-general.html
	// https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/command-options-specific.html#command-options-nodejs
	setting {
		namespace = "aws:elasticbeanstalk:environment"
		name      = "LoadBalancerType"
		value     = "application"
	}
	setting {
		namespace = "aws:ec2:vpc"
		name      = "VPCId"
		value     = "${aws_vpc.main.id}"
	}
	setting {
		namespace = "aws:ec2:vpc"
		name      = "Subnets"
		value     = "${join(",", "${data.aws_subnet_ids.public.ids}")}"
	}
	setting {
		namespace = "aws:autoscaling:launchconfiguration"
		name      = "EC2KeyName"
		value     = "${var.keyname}"
	}
	setting {
		namespace = "aws:elasticbeanstalk:container:nodejs"
		name      = "NodeCommand"
		value     = "node httpd.js"
	}

}
