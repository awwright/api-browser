
all: aws-ebs.zip

aws-ebs.zip:
	#rm -f $@
	#zip -r $@ * .[^.]*
	zip -r $@ style.css ui.js httpd.js package-lock.json package.json
