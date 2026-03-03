#!/usr/bin/perl
use strict;
use warnings;
use File::Copy qw(copy);
use File::Find;

my $snippet_file = 'nav-snippet.html';
open my $s, '<:encoding(UTF-8)', $snippet_file or die "Erreur: $snippet_file introuvable\n";
local $/;
my $nav_snippet = <$s>;
close $s;

my $count = 0;
find( \&process_file, '.' );
print "Done. Files updated: $count\n";

sub process_file {
  return unless -f $_;
  return unless /\.html$/i;
  return if $_ eq $snippet_file;
  my $file = $File::Find::name;
  open my $fh, '<:encoding(UTF-8)', $file or return;
  local $/;
  my $content = <$fh>;
  close $fh;

  # Cherche une balise <nav ... class="...navbar..." ...>...</nav>
  my $pattern = qr{<nav[^>]*[[:space:]]class[[:space:]]*=[[:space:]]*(['"][^'"]*navbar[^'"]*['"])[^>]*>.*?</nav>}is;

  if ($content =~ $pattern) {
    copy($file, "$file.bak") or warn "Impossible de sauvegarder $file -> $file.bak: $!";
    $content =~ s/$pattern/$nav_snippet/;
    open my $out, '>:encoding(UTF-8)', $file or die "Impossible d'écrire $file: $!";
    print $out $content;
    close $out;
    print "Updated: $file (backup $file.bak)\n";
    $count++;
    return;
  }

  # Fallback : ancien marqueur commenté
  if ($content =~ /<!--\s*=====\s*Barre de navigation principale\s*=====.*?<\s*\/nav\s*>/is) {
    copy($file, "$file.bak") or warn "Impossible de sauvegarder $file -> $file.bak: $!";
    $content =~ s/<!--\s*=====\s*Barre de navigation principale\s*=====.*?<\s*\/nav\s*>/<!-- ===== Barre de navigation principale ===== -->\n$nav_snippet/is;
    open my $out, '>:encoding(UTF-8)', $file or die "Impossible d'écrire $file: $!";
    print $out $content;
    close $out;
    print "Updated (marker): $file (backup $file.bak)\n";
    $count++;
  }
}