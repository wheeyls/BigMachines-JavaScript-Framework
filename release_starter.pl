use strict;
use File::Copy;

my $src = @ARGV[0];
my $dest = @ARGV[1];

my @list = qw(allplugins-require commerce commerce_line config homepage logger manager test_util);

foreach my $file (@list) {
	print "Copying: $file.js\n";
	copy("$src/$file.js","$dest");
}