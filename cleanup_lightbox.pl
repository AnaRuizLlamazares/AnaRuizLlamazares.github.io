#!/usr/bin/perl
use strict;
use warnings;
use File::Copy qw(copy);

my $file = 'la-maison-ou-le-pouvoir-de-rentrer-en-soi-meme-2012.html';
copy($file, "$file.bak") or die "Backup failed: $!";

local $/;
open my $in, '<:encoding(UTF-8)', $file or die "Open failed: $!";
my $html = <$in>;
close $in;

# 1. Supprimer le bloc <div id="lightbox"> ... </div>
$html =~ s{<div[^>]*id="lightbox"[^>]*>.*?</div>}{}gis;

# 2. Supprimer scripts contenant mots-clés lightbox
$html =~ s{<script\b[^>]*>[^<]*(?:(?:(?!</script>).)*(lightbox-overlay|openLightbox|closeLightbox|lightbox-open|lightbox-exit|lightbox-img|lightbox-caption|lightbox-exit-btn|data-lightbox-open).)*?</script>}{}gis;

# 3. Dans chaque <style>, retirer uniquement les règles lightbox (sans supprimer le reste)
$html =~ s{(<style\b[^>]*>)(.*?)(</style>)}{
    my ($open,$css,$close)=($1,$2,$3);
    # enlever blocs contenant .lightbox-*, #lightbox-*, body.lightbox-open ou body\[data-lightbox-open]
    $css =~ s{[^{}]*?(?:\.lightbox[-\w]*|#lightbox[-\w]*|body\.lightbox-open|body\[data-lightbox-open]).*?\{.*?\}}{}gs;
    # si le style est devenu quasi vide, on le retire
    $css =~ /\S/ ? "$open$css$close" : "";
}egis;

# 4. Retirer le second bloc nav dupliqué (deuxième <style> consécutif contenant ".nav-logo a")
my $count_nav = 0;
$html =~ s{(<style\b[^>]*>)(.*?\.nav-logo a.*?)(</style>)}{
    ++$count_nav;
    $count_nav > 1 ? "" : "$1$2$3"
}egis;

# 5. Nettoyer doubles lignes vides
$html =~ s/\n{3,}/\n\n/gs;

open my $out, '>:encoding(UTF-8)', $file or die "Write failed: $!";
print $out $html;
close $out;

print "Nettoyage terminé. Sauvegarde: $file.bak\n";