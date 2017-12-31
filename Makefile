
aws-ebs.zip:
	#rm -f $@
	#zip -r $@ * .[^.]*
	zip --exclude '.git/*' --exclude 'terraform/*' --exclude 'node_modules/*'  -r $@ *
