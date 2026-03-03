#!/usr/bin/perl
use strict;
use warnings;
use File::Copy qw(move);

my $snippet = 'nav-snippet.html';
open my $s, '<:encoding(UTF-8)', $snippet or die "Erreur: $snippet introuvable\n";
local $/;
my $nav = <$s>;
close $s;

foreach my $file (glob("*.html")) {
  next if $file eq $snippet;
  open my $in, '<:encoding(UTF-8)', $file or next;
  local $/;
  my $content = <$in>;
  close $in;
  if ($content =~ s/<!--\s*=====\s*Barre de navigation principale\s*=====.*?<\/nav>/<!-- ===== Barre de navigation principale ===== -->\n$nav/is) {
    move($file, "$file.bak") or die "Impossible de sauvegarder $file: $!";
    open my $out, '>:encoding(UTF-8)', $file or die "Impossible d'écrire $file: $!";
    print $out $content;
    close $out;
    print "Updated: $file (backup $file.bak)\n";
  } else {
    print "No nav block found in $file\n";
  }
}