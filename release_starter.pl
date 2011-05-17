use strict;
use IO::Compress::Zip qw(zip $ZipError);
use Time::localtime;

my $opt_h;
if($opt_h) {
	print "Usage: perl $0 {source} {dest}\n";
	print 'Copy Javascript files from {source} to {dest}.' . "\n";
	print 'Also creates a zip archive and sets @version to current time';
	exit 0;
}

my $src = @ARGV[0] || "test_demo/js";
my $dest = @ARGV[1] || "js_starter/javascript";

my @list = qw(allplugins-require logger manager test_util);
my @from_template = qw(commerce commerce_line config homepage sitewide);
my @css_files = qw(qunit);
my @all_files = @list;

# read in template
push(@all_files,@from_template);
push(@all_files,@css_files);
my $template_file = "$src/blank_template.js";
print "$template_file\n";
open(TEMPLATE,"<$template_file") or die "No template: $!";
my @template_lines = ();
while(<TEMPLATE>) {
	push(@template_lines,$_);
}
close(TEMPLATE);

my @date = localtime(time);
my $datestr = ctime();
print "$datestr\n";

foreach my $file (@all_files) {
	my $ext = "js";
	if(grep /$file/,@css_files) {
		$ext = "css";
	}
	open(OUT,">$dest/$file.$ext") or die $!;
	if(grep /$file/,@from_template) {
		foreach my $temp_line (@template_lines) {
			$temp_line =~ s/(\@version).*/$1 $datestr/;
			print OUT $temp_line;
		}
	} else {
		open(IN,"<$src/$file.$ext") or die $!;
		while(<IN>) {
			s/(\@version).*/$1 $datestr/;
			print OUT $_;
		}
	}
	print "Copying: $file.$ext\n";
	close(OUT);
}

chdir($dest);
zip "<*.{js,css}>" => "../PS.BIF.JA.09 - Javascript.zip"
        or die "zip failed: $ZipError\n";
