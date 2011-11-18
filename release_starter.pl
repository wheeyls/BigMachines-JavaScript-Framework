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
my $upgrade_dest = @ARGV[2] || "js_upgrade/javascript";

my @list = qw(bm-framework.js text.js return_to_quote_button.js commerce_ids.js jquery_cookie.js);
my @from_template = qw(commerce.js commerce_line.js config.js homepage.js sitewide.js);
my @upgrade_files = qw(bm-framework.js upgrade.html text.js return_to_quote_button.js);
my @all_files = @list;

# read in template
push(@all_files,@from_template);
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
	open(OUT,">$dest/$file") or die $!;
	if(grep /$file/,@from_template) {
		foreach my $temp_line (@template_lines) {
			$temp_line =~ s/(\@version).*/$1 $datestr/;
			print OUT $temp_line;
		}
	} else {
		open(IN,"<$src/$file") or die $!;
		while(<IN>) {
			s/(\@version).*/$1 $datestr/;
			print OUT $_;
		}
	}
	print "Copying: $file\n";
	close(OUT);
}

foreach my $file (@upgrade_files) {
	open(OUT,">$upgrade_dest/$file") or die $!;

	open(IN,"<$src/$file") or die $!;
	while(<IN>) {
		s/(\@version).*/$1 $datestr/;
		print OUT $_;
	}

	print "Copying: $file\n";
	close(OUT);
}

chdir($dest);
zip "<*.{js,css,html}>" => "../javascript.zip"
        or die "zip failed: $ZipError\n";
chdir("../..");
chdir($upgrade_dest);
zip "<*.{js,css,html}>" => "../javascript.zip"
        or die "zip failed: $ZipError\n";
