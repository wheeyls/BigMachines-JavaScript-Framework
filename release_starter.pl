use strict;
use File::Copy;
use IO::Compress::Zip qw(zip $ZipError);
use Time::localtime;

my $src = @ARGV[0];
my $dest = @ARGV[1];

my @list = qw(allplugins-require commerce commerce_line config homepage logger manager test_util);

my @date = localtime(time);
my $datestr = ctime();
print "$datestr\n";

foreach my $file (@list) {
	print "Copying: $file.js\n";
	copy("$src/$file.js","$dest");
	open(IN,"<$src/$file.js") or die $!;
	open(OUT,">$dest/$file.js") or die $!;
	while(<IN>) {
		s/(\@version).*/$1 $datestr/;
		print OUT $_;
	}
}

chdir($dest);
zip "<*.js>" => "../javascript.zip"
        or die "zip failed: $ZipError\n";