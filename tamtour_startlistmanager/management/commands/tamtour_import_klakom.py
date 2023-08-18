"""
Import Klakom data (currently hardcoded)
"""

from django.apps import apps
from django.db import IntegrityError
from django.core.management.base import BaseCommand

kompositionen = """
007|Ch. Avanthay
1349|C. Buchwalder
1603|L. Chappaz
1506 G.S.P.|Ch. Debons
18er Retraite|W. Locher
1959 - 2008|T. Weggler
1er Mars|A. Petitpierre
21 heures|L. Chappaz
3:2 Distotion|P. Mason
4 YOU|Ch. Jost
4-4-2|S. Walthert
44er|unbekannt
48er|A. Flach
64er|A. Haefeli
70er |J. Rieser
84er|A. Haefeli
99'ger|St. Federspiel
Aarau 2006|H. Luterbacher
Aarauer Tambouren|U. Hunziker
Aare, a dr|H. Luterbacher
ab uff Gass|I. Kym
Abarth|R. Betschart
Absturz|St. Jentsch
Acclaim|St. Stempfel
Accolade|D. Gachet
Acryl|R. Di Martino
Adapter, dr|N. Wesp
Adjudant, dr|Ph. Meyer
Ädle, de|J. Künzle
Adorina|U. Gehrig
Adrenalin|R. Liechti
Affe, d|P. Mason
Aggzänt, dr|S. Schwob / W. Hagen
Ägypter|A. Kurz
Ailaghoga-Marsch|E. Hüppi
Airbus|A. Wymann
Airport|A. Wymann
Akrobat|A. Wymann
al dente|R. Di Martino
Albani-Tagwacht|H. Koradi
Albertus|P. Jeltsch / G. Trincherini
Albisrieder, de|W. Forster
Alegria|R. Liechti
Allegra|R. Di Martino
AllmändGroove, dä|J. Wohlgemuth
Allobroges|N. Fraternali
Allotria|A. Scheuber
Alpechalb, s|I. Kym
Alte Franzosen|überliefert
Alte französische Retraite|Historisch / A. Martin
Alternance|D. Quinodoz
Alvier|W. Blaser
Ambassador|F. Scheidegger
Amber Alchemy|S. Metrailler
Amedes|R. Lombriser
Ämme-Schnägg, der|T. Hubacher
Anamosa|L. Chappaz
Ancient Train|M. Imlig
Andalusia|R. Liechti
Andrsch|P. Thommen
Angoisse|R. Barras
Anicroche|D. Gachet
Anonymous|L. Chappaz
Anpaloke|St. Weisshaupt
Antje|I. Kym
Aperobique|P. Robatel
Apollo|I. Kym
Aprico|P. Stalder
Aprili|W. Blaser
Aquilone|E. Spahr
Arabesques|R. Metrailler
Aramis|Ph. Meyer
Arc-en-Ciel|G. Metzener
Are you crazy?!|Ch. Gnägi
Aréna 91|L. Salamin
Ares|M. Hobi
Argovia|U. Gehrig
Argovia 04|R. Schlebach
Armeespiel Tagwacht|R. Liechti
Arogo Drive|M. Imlig
Arosa Bähnli, ds|S. Müller
Ascension|L. Salamin
Aschi 1.0, dr|A. Frei
Aschi 2.0, dr|A. Frei
Äschlibueb|Th. Egli
Assurancetourix|D. Gachet
Asterix|W. Blaser
Attentäter|M. Hobi
Aubade|D. Quinodoz
Aurora|B. Kirmess
Aussenberger, dr|F. Berger
Avanti|M. Imlig
Avenir, l'|E. Etter
Aventure|D. Derrer
Azur|D. Gachet
B 52|M. Noti
Bacchanal|P. Wirz
Backslash|R. Liechti
Bacon's Parade|R. Barras
Bagatelle I|M. Emery
Bagatelle II|M. Emery
Baggenstos March|P. Mason
Bagheera|L. Krautheim
Bajazzo|J. Gagg
Balade|D. Quinodoz
Balbeila|Jan Künzle
Balé classic|R. Liechti
Ballaballade, die|D. Rolly
Baloo the Bear|Ph. Müller
Bambi|V. Bearth
Bambino|R. Metrailler
Bambus|M. Regenass
Bananenblues, dr|arr.U. Scheuber
Banbochi|M. Esseiva
Bäremutz|R. Liechti
Bäretanz|A. Haefeli
Bärgdambour|Ph. Meyer
Baritmica|R. Liechti
Bärli-Biber|W. Blaser
Bärnerbär, dr|B. Wittwer
Barracuda|D. Liechti
Barry, dr|B. Ruf
Baschdi, dr|A. Melches
Basel 08|R. Lombriser
Basel 2034|F. Egger
Basel Basic|J. Wohlgemuth / C. Fehr
Basel City|I. Kym
Basel Clouds|P. Mason
Basel Nord|I. Kym
Baselstab|W. Blaser
Basel-Süd|I. Kym
Basics|R. Liechti
Basilea|W. Blaser
Basilikum|S. Mani
Basinga|P. Hersberger
Basle Anniversary March|auskind USA
Basler Etüden|R. Liechti
Baslertagwacht, einfache|C. Dischler
Beat, dr|P. Stalder
Beat'babe|P. Hersberger
Beautiful|P. Robatel
Belgarion|P. Wirz
Benita|R. Liechti
Benito|R. Liechti
BEO 03|B. Christen
Beresina-Marsch|A. Luterbach
Berloque, la|L. Salamin
Berna|A. Haefeli
Berna-Bern|H. Luterbacher
Bernafonie|R. Liechti
Bernensis|A. Wymann
Berner Tagwacht|R. Liechti
Bethania|N. Wasmer
Biätschhornfäger|S. Karlen
Biber, dr|H. Luterbacher
Big Boy|R. Barras
Big-Ben|B. Hungerbühler
Bigfoot|B. Schmid
Biirestiil|F. Rhyn
Bijou|U. Beck
Billiard|R. Liechti
Bilorischem|M. Emery
Binggis|A. Haefeli
Binôme, le|J. Büschi
Birgerwind|U. Scheuber
Birth of Drums|F. Baeriswyl
Black & White 2000|R. Lombriser
Black Jack|U. Gehrig
Black Knight|R. Mühlethaler
Black Tower|W. Gloor
Blackbird|W. Gloor
Blackout|C. Summermatter
Bläggy, dr|A. Melches
Bleichügeli|I. Kym
Blitz, dr|J. Rolle
Blooggaischd, dr|B. Kirmess
Blue Water|M. Ruprecht
Blutzger|R. Siegrist
Boldewyn|R. Betschart
Bolonka|H. Luterbacher
Bombonera, la|S. Azzouz
Bo-Mue-Ho|H. Honold
Bonfire|P. Reichlin
Bonifaz|I. Kym
Bonne retraite M. Stuker|R. Barras
Böögg, dä|P. Hässig
Bootlegger|P. Wirz
Borkechäfer|F. Rohr
Botti, dr|R. Müller
Botzalet|D. Gachet
Bouébo|D. Gachet
Brasilea|R. Lombriser
Break Time|J.Ph. Brun
Breakfast|R. Liechti
Briger-Retraite|L. Escher
Brismalo|I. Kym
Britchone, la|A. Petitpierre
Brösmeli, s'|A. Wymann
Broyarde, la|J. Barras
Brräggtätlägg|M. Heinen 
Brugger|H. Hediger
Brunivan, de|L. Kiefer
Brutus|R. Grieder
Bubenberg|A. Flach
Bubenberg|W. Egli
Büchsenmarsch|U. Stoob
Buebeli, s'|E. Perruchoud
Bullshit|R. Liechti
Bumerang|H. Honold
Buon Viaggio|M. Imlig
Burenmärsche|E. Krug
Butterfly|A. Haefeli
By Land and Sea|M. Bolt
Ça Joue|J. Buschi
Cabriole|R. Metrailler
Cadences|W. Blaser
Cadets, les|W. Blaser
Caesars Palace|L. Frochaux
Caipirinha|D.F. Meyer
Calandawolf, dr|S. Ludwig
Calibra|R. Lombriser
Caliméro|L. Salamin
Callicarpa|M. Francey
Callisto|M. Emery
Calvarillos|R. Müller
Calypso|D. Gachet
Camino, el|M. Hutter
Canicule|S. Droux
Canne-Major|R. Morat
Cannonball|R. Brunschwiler
Capita|U. Gehrig
Capone, dr|K. Rodemerk
Capriccio|D. Gachet
Caprices|R. Barras
Capricorn|H. Koradi
Capricorn|Ch. Ramo
Capu|C. Woodtli / S. Azzouz
Caramba|F. Baeriswyl
Carnaval|W. Blaser
Carnavalesques|M. Emery
Carolina Reaper|B. Kirmess
Carpe Diem|R. Liechti
Cartouche|P. Wirz
Casa 20|M. Favre
Cascade|D. Quinodoz
Casper|S. Stempfel
Castiadas|M. Grätzer
Castorica|R. Liechti
Cat' Zamis, les|M. Emery
Cavalcade|L. Salamin
CCII|L. Chappaz
Celanese|F. Berger
Celebration|I. Kym
Centenary March|D. Gachet
Cento|P. Leuzinger
Cerberus|D. Grieder
CH 91|A. Wymann
Challenge|R. Mühlethaler
Challenger|St. Jentsch
Champagne|M. Imlig
Chap'09|Ch. Avanthay
Chargé pour Soleure|M. Woodtli
Charivari|J. Willi
Charmey|R. Barras
Chaschperli|M. Imlig
Chat, Le|D. Gachet
Chaton, Le|D. Gachet
Chatzestrecker|R. Herger
Checkpoint|T. Weggler
Cheese-Spezial|I. Kym
Cheese-Track|J. Büschi
Chemifäger, dr|I. Kym
Chermignon|W. Blaser
Chilbi-Trubel|M. Imlig
Chindâ|W. Locher
Chinderfäscht-Marsch|H.P. Völkle
Chindzèri|M. Esseiva
Chipsy|S. Müller
Chlapfgass-Fäger|M. Imlig
Chlepfer|U. Beck
Chlöisu, dr|A. Winkler
Chlopf-Geischt|M. Imlig
Chnebelbueb, dr|Th. Marty
Chnochebrächer|S. Seiler
Chnorz|U. Beck
Chnuri, dr|R. Lombriser
Chöttihammertaler, dr|S. Ludwig
Chrapfe-Muschter|M. Imlig
Chrieger, dr|L. Christ
Chrienser, dr|R. Helbling
Chriesibueb, dr|I. Kym
Churer-Marsch|H. Koradi
Cilaos|D. Gachet
Ciney speciale, dr|D.F. Meyer
Ciney, dr|D.F. Meyer
Classified|A. Martin
Classique, la|I. Kym / F.Scheidegger
Clémence, la|L. Chappaz
Cocktail|R. Barras
Code Red|Ch. Gnägi / G. Wyss
Coliseum|P. Robatel
Colorado|R. Glaus
Comet|B. Morel
Comfort Pulse|M. Imlig
Compact|R. Müller
Concorde|A. Wymann
Connor|Y. Vallotton
Constellation|V. Vuilleumier
Continental Drift|R. Brunschwiler
Contre - Pied|M. Imlig
Cool Cat|R. Liechti
Cool Man|F. Baeriswyl
Cool Spirit|M. Imlig
Copacabana|R. Brunschwiler
Copernic|Ch. Crausaz
Corine|M.Emery
Corn Flakes|P. Robatel
Corpataux 97|R. Barras
Corpus Delicti|I. Kym
Corpus Domini|D. Gachet
Corsica dicessétte|St. Jeannin
Corvette|R. Betschart
Cosmabovo|Ch. Avanthay
Cosy|D. Gavillet
Cottens-Swing|R. Barras
Coulisse, en|D. Quinodoz
Countdown|U. Beck
Court Métrage|L. Salamin
Craigshire|B. Stähli
Crank|J. Willi
Crazy Chicken|R. Liechti
Crazy Juniors|B. Maurer
Crazy Shit|P. Hersberger
Crêtelongue|M. Emery
Crochade|F. Panchaud
Croisillon|P. Wirz
Crucelin|D. Rogger
Cuchulain|Y. Vallotton
Cumbia|B. Dijkgraaf
Cumulus|E. Etter
Cuquicu|V. Egger
C-West|M. Favre
Cygognier, le|D. Gachet
Dakos|C. Woodtli
Dalbenmarsch|K. Furler
Daltons, les|B. Monney
Dampfloki|R. Liechti
Dance rhythmique|M. Imlig
Dänl, dr|D. Läng
Danza, la|R. Mühlethaler
Dark Vision|R. Geering
Debarasser|R. Geering
Deep South|J. Duruz
Défilé|R. Barras
Défilé de Majorettes|E. Etter
Défilé des majorettes|O. Brühwiler
Defiliermarsch|A. Haefeli
Demi-Siècle|L. Salamin
Derby|F. Voisard
Dérobade|R. Metrailler
Désillusions|E. Varone / D. Steinmann
Deux, les|U. Ruoss
Diablotins, les|L. Orsinger
Diabolino|JY. Zwahlen
Diabolo|R. Lombriser
Diane 2000|W. Blaser
Diane de la Broye|R. Barras
Diane des Artistes|W. Blaser
Diane des Cadets|W. Blaser
Diane oenologique|M. Emery
Diavolo|R. Liechti
Diddl-Duddl|Ph. Müller / M. Hadorn
Digi Tal, dr|J. Ledermann / F. Moser
Disä|M. Wasem / V. Egger
Disploration|G. Debons
Divertimento|P. Robatel
Divisions-Tagwacht|A. Flach
Dobbeldegger|A. Müller
Dobry Den|Y. Vallotton
Dolce Vita|R. Liechti
Dolgge, dr|D.F. Meyer
Dominic|R. Liechti
Don Camillo|M. Jeanneret
Don Sancho|M. Emery
donkey|M. Ruprecht
Don't Look Back|L. Frochaux
Doodle|L. Frochaux
Double Snuff and Five|U. Wieland
Double Trouble|L. Wasem
Dramper|M. Regenass
Drei Käsehoch|R. Herger
Dreier|überliefert
Dreyzagg|R. Grieder
Drill|Ph. Meyer
Drive Twice|M. Imlig
Drop Kick|M. Imlig
Droping Stones|R. Geering
Druggede|F. Rhyn
Drühredli, s'|Ph. Nückles
Drum - Rush|M. Imlig
Drum & Bass|Ph. Inderkummen
Drum Festival|A. Haefeli
Drum tune|U. Ruoss
Drum Twins|T. Jamin
Drum Twirl|St. Arnold / W. Arnold
DrumaQueen|P. Hersberger
Drum-Beach|L. Salamin
Drummel Freund|B. Dijkgraaf
Drummer Boy|N. Wasmer
Drummer-Retraite|R. Liechti
Drumming Gringos|Ph. Müller
Drummler, dr|A. Haefeli
Drum'n'Bass Fire|Ph. Meyer
Drum-Parade|A. Haefeli
Drum-Party|A. Haefeli
Drum-Teacher|A. Haefeli
Du Rhône au Rhin|P. Wirz
Du und ych|B. Kirmess
Durlibbs|B. Hunziker
Düsefäger|F. Berger
Duvel, dr|D. Meyer
Dynamo|E. Schnydrig
Early Bird|U. Gehrig
East Am Tune|M. Imlig
Easy-Flow|M. Imlig
ECB 07|D. Magnin
Echec et mat|L. Frochaux
Echo du Lac|R. Barras
ECI 87|P. Robatel
Eclipse|D. Quinodoz
Edinburgh|W. Blaser
Edinburgh II|W. Blaser
Eedelwyss, s|A. Grieder
Effort|St. Kayser
Egészségedre|Y. Vallotton
Eichhörnli|L. Krautheim
Eichliacker|R. Lüscher
Eidgenosse|R. Heim
Electrical Storm|M. Zollet
Elements|D. Puser
Elephants|D. Planchon
Eleven|R. Liechti
Eligius|St. Stempfel
Emotion|M. Imlig
EM-Parade|C. Boss
Empire|M. Bolt
Energy|R. Jakob / I. Kym
Enfant terrible|M. Pasquon / M. Stämpfli
Enigma|S. Stempfel
Enjoy|D. Locher
Enobile|J. Künzle
Epinal|überliefert
Erdrutsch|S. Müller
Erschmatt 2019|C. Summermatter
Eruption|M. Imlig
Erva, dr|M. Emery
Espara'dos|G. Debons
Espresso|R. Di Martino
Esprit|F. Egger
Essais|B. Debons
Etude|M. Emery
Eule die|Rémy Müller
Euphorie|P. Reichlin
Eurêka!|R. Mühlethaler
Evasion|L. Salamin
Eventos|W. Locher
Exodus|P. Robatel
Exotikus|D. Liechti / R. Liechti
Expendable|D. Planchon
Facilis|L. Salamin
Fäger, dr|H. Jundt
Fälichutzeler, d'|St. Marty
Falkebärger|F. Berger
Fanchon|W. Blaser
Fantaisie Rythmiques|G. Debons
Fantasie Ticinese|W. Blaser
Fantasie-Moderne|A. Haefeli
Faschtewaje|I. Kym
Fasnachts-Chüechli|P. Mason
Fast Food|R. Liechti
Faszination|A. Haefeli
Fatale|E. Schnydrig
Fätze, dr|M. Lüthi
Fauchi|R. Di Martino
Feeling|R. Liechti
Feelings|A. Haefeli
Feldgrau|A. Flach
Festival|arr.F. Tribelhorn
Festivités|A. Hoffmeyer
Festory|J.I. Zwahlen
Feu sacré|I. Kym
Fiesta|A. Haefeli
Figaro|S. Holliger
Fignolements|D. Quinodoz
Figura Basilea|M. Imlig
Filou, Le|Ph. Müller
Finalissima|St. Freiermuth
Finn, dr|H. Luterbacher
Fire|R. Liechti
Firlifanz|U. Stoob
First|R. Liechti
First Step|D. Gachet
Fläderbär|St. Jentsch
flagada|D. Gachet
Flam Parade|St. Stempfel
Flandrin|P. Wirz
Flashback|M. Imlig
Flash-marche|A. Petitpierre
Flavor, the|F. Tran
Fleurisia|R. Mühlethaler
Flight 16-80|D. Magnin
Flight for Juniors|L. Orsinger
Flip Flop|Ph. Nückles / R. Di Martino
Flood|D. Planchon
FlowTime|R. Liechti
Flying Hirsch|A. Scheuber
Flying Trapeze|P. Mason
Föhn, dr|R. Schäuble
Fohosiwa|A. Haefeli
Folasse|Dylan Puser
For Ever|B. Panchaud
For Young Boys|R. Jakob
Fortuna|A. Ruoff
Forty-Four|D. & R. Liechti
François, Le|R. Heim
Frauenkappelen|N. Von Allmen / M. Zollet
Freeride|L. Frochaux
Free-style|D. Magnin
Freetime|R. Metrailler
Freeze|Ph. Haller
Freiheit|A. Haefeli
Freiheit|unbekannt
Freimärsche|unbekannt
Freitag der 13.|R. Liechti
Frem, le|V. Heynen
Frenkentaler|F. Wahl
Fribourgeoise, La|M. Gumy
Frisch voran |A. Haefeli
Frischling, dr|M. Loosli
Frisson|J. Büschi
Frühlingsbote|F. Baeriswyl
Frühlingstrommi|M. Emery
Frutigmarsch|H. Krieg
Fuka-Marsch|K. Furler
Full House|M. Landis
Full Metal Jacket|M. Zollet
Funkadelic|P. Genhart
Funked up|D. Planchon
Funky Spirit|R. Lombriser
Furioso|I. Kym
Fürstenland Tagwacht|R. Lombriser
Fürstenländer|R. Lombriser
Fürstenländer (Rieser)|J. Rieser
Furz|M. Regenass
Fusion|Ch. Gnägi
Fustibus|P. Kundert
Fyrdeyfel|S. Quercioli
Gaageli, dä|M. Marchetti
Gaillard rusé|D. Puser / T. Weggler
Galaxy Racer, dä|A.Fischer/M.Heider/J.Künzle
Galgevogel, dr|R. Beljean/M. Jenni
Gallier, dr|C. Buchwalder
Gallo pinto|L. Spescha
Gardischt, dr|A. Frei
Gardon, le|D. Gachet
Garota de Brasil|M. Estoppey
Gassegott|M. Loosli / C. Müller
Gässler, dr'|A. Haefeli
Gässli 6|TV Lenzburg
G-Bang|P. Grossmann
Geifetsch, der|M. Hutter
Gene Kruppa|R. Liechti
Gene-o by Charles c.Simons|arr.H.P. Völkle
Géneral Guisan (Bas.-Stil)|F. Berger
General Guisan (Ord.-Stil)|F. Berger
Generation Y|I. Kym
Generations|R. Liechti
Generatore di Rumore|Chr. Müller, M. Wüthrich
Genferei|S. Walthert
Genion|M. Emery
Geronimo|St. Stempfel
Ghörschutz|S. Holliger
Gibraltar|M. Bolt
Gimellis|D. Gachet
Giomber, il|V. Bearth
Gipfelstürmer, dr|K. Doshi
Giubileo|U. Gehrig / Ph. Müller
Give it to me|P. Hersberger
Glaibasler, d'|R. Meyer
Gland 2003|P. Wirz
Glencoe|F. Rhyn
Glissade|J. Barras
Globi, dr|C. Summermatter
Globitrotter|R. Lombriser
Glögglifrösch, dr|E. Kohler
Gloon, dr|L. Künzle
Gloschar, dr|M. Wälti
Gnäggis, dr|Ph. Meyer
Gneggis, dr|A. Grieder
Gnom|R. Geering
Gnorzi, dr|N. Andersen
Gobar|M. Imlig
Goldküsten-Marsch|E. Heller
Good Vibes|M. Pasquon / J. Ledermann / A. Scheuber
Goofy|Ch. Gnägi
Gorilla|E. Lauener
Gossi|R. Lombriser
Gote, d|R. Grieder
Gourmandise|M. Emery
Gracias olé|R. Brunschwiler
Graduation|N. Hostettler
Graffiti|R. Metrailler
Gran Turismo|S. Reist
Granges-Marnand 98|L. Salamin
Grashüpfer|R. Liechti
Grauholz|A. Flach
Gremlins|I. Kym
Grenchenermarsch|J. Bieli
Grenzbesetzung|O. Tobler
Gribourf|G. Metzener
Grien Hund, dr|A. Melches
Grillon, le|D. Gachet
Grimbart|R. Betschart
Grischuna|H. Koradi
Grisu|S. Müller
Grizzli, dr|H. Luterbacher
Grünschnabel|R. Liechti
Gruss aus Brig|L. Escher
Gruss aus Erschmatt|W. Locher
Gruss aus Herrliberg|E. Heller
Gruss aus Spiez|B. Wittwer
Guldental 2014|A. Frei
Guldenthaler |A. Haefeli
Gümper, d|E. Hofer
Gumpesel, dr|I. Kym
Gundeli, s|U. Gehrig
Güüfeli, s|A. Bachmann
Gwaggli, dr|B. Kirmess
Gwerder Marsch, dä|M. Bolt
Habi, dr|M. Hobi
Haimlifaiss|F. Rhyn
Half Dollar|M. Rossi
Hall's Call, The|B. Monney
Hamburger|R. Liechti
Happy Birthday|V. Vuilleumier
Happy Day|A. Haefeli
Happy Landing|R. Lombriser
Happy Oberland|F. Baeriswyl
Hardermanndli, d's|M. von Allmen
Härdopfukönig, dr|A. Hauert
Harlekin|U. Blaser
Harlequin|U. Lüond
Harrogate|W. Blaser
Härzbluet|I. Kym
Hasta Luego|B. Kirmess
Hattrick|M. Oswald
Häxetanz|R. Liechti
Hebsteläd, s|P. Müller
Hellebardier, dr|S. Schmid
Henry Dunant|M. Emery
Heptade|M. Emery
Héraut, le|L. Chappaz
Hercules|R. Liechti
Herisau|W. Blaser
Herisauer|R. Derungs
Hermes|S. Müller
Hésitations|G. Debons
Heugaable, d|C. Buchwalder
Heugümper, dr|M. Otter
Hexagramm, s'|A. Martin
Hieronymus, H.|R. Grieder
High Five|R. Brunschwiler
Highlight|S. Hug
Highway|R. Brunschwiler
Hipstergspängschtli|M. Pasquon, J. Ledermann,
History|R. Liechti
Hit-fair|N. Wasmer
Hits on Drums|R. Barth
Hohlemätz|M. Zollet
Hokus-Pokus|A. Scheuber, M. Pasquon, J. Ledermann
Holdrio|M. Stämpfl
Holländer|überliefert
Hommage à Willy Blaser|R. Lombriser
Höngger, de|W. Forster
Hono-lulu|R. Di Martino
Hopfenperle|R. Liechti
Hopsala|L. Salamin
Horizon 2000|G. Metzener
Hot Dog|R. Liechti
Hot Stuff|R. Liechti
HotFix|R. Liechti
Hudizältli, s'|C. Schmidig
Hugetobler, dr|M. Pasquon
Humulus|M. Frabcey/D. Planchon/S. Droux
Hurricane|W. Locher
Hypnose|S. Métrailler
Ice Power|I. Kym
Ici c'est Fribourg !|Ch. Crausaz
Ictus|A. Peter
Idéo|M. Favre
Ignusa|J. Künzle
Iguana|Ph. Müller
Imagination|R. Liechti
Imagique|U. Wieland
Imperator|R. Métrailler
Important persons|I. Kym
Impossible|P. Destraz
Impuls|D. Rogger
Impulse|L. Frochaux
In der Schweiz|H. Krieg
Indianar, dr|D. Müller / O. Fischer
Inferno|I. Kym
Infinity|E. Schnydrig
Inflagranti|I. Kym
Innerschwyzer|K. Kappeler
Input|Ch. Gnägi
Ins Gelände|überliefert
Insanités|R. Herzig
Insomnia|P. Reichlin
Inspiration|R. Liechti
Instructor WB|R. Morath
Intégration|M. Estoppey
Intermezzo|A. Haefeli
Intus|R. Lombriser
Inversion|N. Cettou
Invictus|L. Chappaz
Invitation|E. Etter
Irish Tune|M. Imlig
Irri, dr|M. Reber
Isetta|R. Betschart
italia flash|D. Bertschi / R. Di Martino
I-Tôôu|Ch. Debons
Iznogod|Y. Vallotton
Jackpot|D. Rogger
Jägermarsch|W. Weidmann
Jakobiner|R. Grieder
James, st|Y. Vallotton
Janissaire|P. Wirz
Janus 77|W. Blaser
Japanesen|D. Sulzer
Jazz de Pique|V. Vuilleumier
Jazz Waltz for Drums|U. Ruoss
Jazz-Time|R. Lombriser
Jeannot|F. Rhyn
Jetlag|I. Kym
Jetstream|T. Weggler / G. Carisch
Jncognito|R. Metrailler
Joker|E. Schmid
Jona Drums|U. Ruoss
Joyeux Guerrier|M. Emery
Jubilar, dr|Gassegötter
Jubiläumsmarsch|K. Angst jun.
Jubiläumsmarsch (Flach)|A. Flach
Jubiläumsmarsch (Müller)|P. Müller
Jubiläumsmarsch 2019|R. Hotz
Jubiläums-Retraite|A. Haefeli
Jubilé|W. Blaser
Jubilee|W. Weidmann
Jubiletto|R. Liechti
JubilGa|Ch. Debons
Jumbo Jet|A. Wymann
Jumula 08|P. Müller
Jung Basler|M. Imlig
Jung und etwas älter|W. Gloor / P. Kundert
Junge Garde|A. Haefeli
Junior|H. Schärer
Junior Retraite|R. Liechti
Juniormarche|D. Quinodoz
Junkfood|R. Liechti
Juons ensemble|L. Salamin
Jura|A. Petitpierre
JuraLac|R. Barras
Ju-Tru-Hei|M. Imlig
K2|L. Krautheim
Käärn, dr'|U. Brunschwiler
Kaffiräämli|U. Gehrig
Kaiman, dr|S. Azzouz
Kakadu|A. Wymann
Kalbfell-Hors d'oeuvre|M. Escher
Kamikaze|N. Wesp
Kapozü-Marsch|W. Weidmann
Karawane|A. Haefeli
Karl, dr|A. Baur
Katz und Muus|F. Voisard
Kayserschmarrn|P. Kundert
Kino Matinée|J. Ledermann / M. Pasquon / A. Scheuber
Kirchberger|R. Liechti
Kirchberger Tagwacht|R. Liechti
KMZ Trommelmarsch 1974|W. Forster
Knacknuss|U. Hunziker
Knalltüfel|R. Herger
Knatteri, de|St. Stempfel
Knecht Ruprecht|R. Liechti
Knifflig, dr|M. Rem
Kobold|U. Beck
Kolibri|R. Di Martino
Kollaps|A. Scheuber
Kormoran, dr|Ph. Meyer
Koschka|M. Wasem
Kraftwerk|U. Gehrig
Krambambuli|A. Haefeli
Kyburger|M. Heusser
L' Art Martial|S. Métrailler
La Marche du Régiment de Castella|R. Barras
La menthe à l'eau|M. Estoppey
Labyrinth|S. Métrailler
Laender chemid, d'|B. Thalmann
LagoMio|I. Kym
Lakeside|M. Landis
Lälli, d|F. Berger
Landschäftler, dr|F. Wahl
Landstriecher, dr|F. Egger
Langenthaler|unbekannt
Langnauer, dr|M. Ferrari
Last Minute|St. Stempfel
Latino-Grooves for Juniors|R. Lombriser
Laubfrosch|Ph. Lovis
Laudatio|R. Betschart
Lava Java|M. Rossi
Learjet|A. Wymann
Legionär|U. Beck
Leischtigsmarsch, där|St. Eyer
Leitmotiv|V. Vuilleumier
Lenzburger|A. Flach
Let's Go|St. Marty
Let's Go Drums|W. Gloor
Leu dr|H. Luterbacher
Léviathan|Ch. Crausaz
Libération|R. Lombriser
Liberté|M. Jeanneret
Liberty|A. Martin
Limit|A. Haefeli
Limmattaler|R. Hotz
Linggä, die|F. Wahl
Little Drum|St. Stempfel
Little Kadett|A. Winkler
Lluvia, la|S. Ludwig
Loch Ness|M. Bolt
Lockdown|C. Summermatter
Lockvogel, dr|I. Kym
Locomotor|E. Sugiarto
Lollypop|I. Kym
Lorem Ipsum|Dylan Puser
Lorrainer|A. Flach
Louis, dr|R. Bukkens
Lowerzer, dr|C. Betschart
Luchs, dr|H. Luterbacher
Lucky Luke|L. Orsinger
Lucky Luke Junior|L. Orsinger
Luftibus|M. Imlig
Luftikus|R. Liechti
L'Unique|P. Stalder
Lusbueb, de|R. Barth
Lutine, la|P. Thommen
Ma Ljuba|C. Woodtli
Maar, der|M. Hutter
Macarouni|S. Müller
Magic Drums|L. Marolf, M. Bütler
Magic Woods|E. Blöchlinger
Magier, dr|A. Frei
Magique|Ph. Müller
Magischter, dr|S. Bringolf
Magnolia|L. Frochaux
Mandala|M. Luyet
Manitu|St. Freiermuth
Mantelet|S. Walthert
Maori, dr|F. Jenny
Maracana|G. Trincherini
Marche de finges|D. Quinodoz
Marche de la Dent de Broc|R. Barras
Marche des Fous, la|M. Emery
Marche des partenaires|N. Cuérel
Marche d'Octodure|arr. L. Orsinger
Marche du 26 mai|L. Renaud
Marche du Centenaire|E. Etter
Marche du Président|R. Barras
Marche du vigneron, la|M. Emery
Marche du Vingtième|N. Donzallaz
Marche pas d'ssus|N. Cuérel
Marche Tambour montreusiens|unbekannt
Marche vaudoue|M. Estoppey
Marching 2011|M. Zollet
Marching Band|R. Liechti
Marching Drummer|A. Haefeli
Marching Drums|D. Andrey
Marciavanti|R. Di Martino
Märmeli|E. Krug
Marsch Exklusiv 08|M. Imlig
Marsch Exklusiv 08 Pure|M. Imlig
Marsche du Rhône|D. Quinodoz
Marsch-Etüde|M. Imlig
Marsch-Exklusiv|M. Imlig
Märschli, z|M. Ruprecht
Marschmallow|R. Herger
Marsch-Tüfel|M. Imlig
Marsch-Vota|M. Imlig
Märtgässler|M. Heusser
Martini Bianco|G. Wyss
Märtyrer, dr|I. Kym
Märzlied|M. Emery
Maschgrade-Tagwacht|M. Imlig
Masquerade|U. Wieland
Matou, le|St. Jeannin
Matrix, the|S. Mani
Mätzli, d|Buser/Hug/Suter
Maverick|S. Reist
Max|B. Liscioch
Meilestei, dr|H. Luterbacher
Mein Regiment|W. Mischler
Mélorocan|Chr. Crausaz
Memento mori|E. Naef
Messager, le|St. Stempfel
Meteor|E. Sugiarto
Mexicain, le|L. Chappaz
Mia san Mia|M. Zufferey
Mifroma remercie Pierre Arnold et ses amis|R. Barras
Milky March|M. Emery
Millénium|J.-I. Zwahlen
Minodunum 90|L. Salamin
Miraculix|R. Lombriser
Mischtgratzerli|E. Lauener
Mistico|D. Gachet
Mixtape|L. Schnüriger
Möckè, d|W. Weidmann
Moderate|C. Heinzmann
Möhlin Jet, dr|F. Egger
Mojito|R. Di Martino
Mokolo|G. Debons
Molotov|S. Ludwig
Momentum|L. Frochaux
Monsum|U. Beck
Moose|H. Luterbacher
Mops, dr|H. Luterbacher
Morat 85|L. Salamin
Morphème|P. Wirz
Moskito|I. Kym
Motivation|R. Di Martino
Moulin Rouge|St. Jentsch
Moustache, la|I. Kym
Move on|T. Börlin
Movimiento Balboa|S. Azzouz, M. Woodtli
Mozzafiato|S. Reist
Mtum|F. Gumy
Mücke|M. Emery
Mucketätscher, dr|T. Weggler
Mühlirad|R. Liechti
Muigg, dr|HP. von Büren
Mulderötzer|M. Balmelli / L. Minder
Muluba|F. Rhyn
Mümliswiler, dr|A. Frei
Mungg, de|P. Thommen
Munggi, s'|P. Thommen
Muni, dr|Ph. Müller / S. Guggisberg
Munot-Marsch|H. Grob
Murmeli, s|H. Luterbacher
Musicavenir 05|E. Etter
Musi-Mélo|L. Frochaux
Musketier, dr|J. Stalder
Mystics|D. Gachet
Mystique|G. Wyss
Nada Rapid|M. Wüthrich
Nanomania|St. Freiermuth / M.Hutter
Näpeli|überliefert
Napoleon|M. Juon
Napolitaner|überliefert
Narr, dr|V. Bearth
Naserümpfer, dr|S. Nussbaumer
Nautilus|S. Jentsch
Neandertaler|W. Hagen
Neo Kinago|M. Imlig
Neptuno, el|V. Heynen
Neue Baslertagwacht|F. Berger
Neue Grenchnermärsche|J. Bieli
New Age|R. Liechti
New CGF|M. Imlig
New Style|M. Imlig
New York City|A. Haefeli
Newcomer|I. Kym
Nickie|G. Metzener
Night, the|W. Weidmann
Niiggii, de|J. Homberger
Nimbus|R. Lombriser
Nine's Parade|L. Salamin
No Name|B. Ruf
Noir ou blanc|R. Barras
NOLA|D. Planchon
NoNole|M. Imlig
Nonstop|I. Kym
Nooni, s|N. Andersen
Nordost|R. Liechti
Nordwest|R. Liechti
Notegrübler, dr|R. Müller
Nouvelle Cuisine|R. Liechti
Nouvelle Epocalypse|T. Weggler
Nouvelle-Marches|M. Berdli
Nova Friburgo|Ch. Roch
Nuevo|L. Spescha
Nussknacker|A. Haefeli
Nynenynzger|E. Lauener
Obelix|R. Liechti
Oberi Houpere|S. Berchtold / M. Zollet
Oberländer (Bas.-Stil)|E. Lauener
Oberländer (Ord.-Stil)|E. Lauener
Obernauer-Marsch|R. Fankhauser
Oberscht, dr|M. Loosli / A. Frei
Oberwalliser|L. Escher
Obina|I. Kym
Octodurus|L. Orsinger
Octopus|D. Rogger
OEnomaüs|L. Chappaz
Okay|N. Wasmer
Olaf, dr|U. Gehrig
Oldie-but-goldie|Ph. Müller
Omega|L. Frochaux
On Parade|M. Bolt
Ondine|D. Gachet
Ondulations|R. Barras
One-eigthy to faky|Ph. Nückles
Online|R. Müller / P. Müller
Only for you|M. Bolt
Orion|W. Weidmann
Österreicher|Ph. Meyer
Oxygène|Ch. Gnägi
P.N.R.|D. Magnin
Padidadim|B. Monney
Pankraz|I. Kym
Panorama|R. Liechti
Panta Rhei|E. Sugiarto
Papaya|Ph. Müller
Papillon|R. Liechti
Paprika|J. Barras
Parabâle|R. Liechti
Parade|E. Etter
Parademarsch|A. Haefeli
Parade-Retraite|A. Haefeli
Paradiddle-Marsch|A. Haefeli
Paradiso|I. Kym / F.Gallacchi
Parampampoli|R. Lombriser
Parcours|St. Freiermuth
Parkinson & Son|D. Rolly
Partita|L. Salamin
Passepartout|R. Grieder
Pätti, dr|D. Bertschi
P-Diddle|M. Landis
Pedibus|D. Gachet
Peewee|Th. Marty
Pendolino, dr|D. Meyer
Pepito|R. Lombriser
Persiflage|M. Imlig
Petersilium Transgeniale|P. Burri
Petit Tambour|M. Emery
Petitbonum|P. Wirz
Petits tambours, les|A. Ruoff
Pétrole-Blues|A. Petitpierre
Pfeifer-Retraite|F. Berger
Pfeifer-Retraite für Junior|W. Blaser
PFL 99|M. Rem
Phänomeno, il|I. Kym
Phantomage|R. Lombriser
Phönix, dr|M. Weiss
Piccolino|A. Haefeli
Piccolo|R. Lombriser
Pickpocket|R. Mühlethaler
Pilot.pdf|R. Lombriser
Pina Colada|S. St. Jentsch
Pingu|V. Bearth
Pinocchio|F. Baeriswyl
Pipifax|I. Kym
Piranhas|H. Blaser
Pirat, dr|P. Stalder
Plaisanterie|D. Quinodoz
Plan B|M. Hutter
Pochade|R. Métrailler
Podium-Marche|A. Droz
Pokémon|R. Liechti
Police Drummer|H. Luterbacher
Polichinelle|M. Emery
Polis'son|G. Debons
Poltergeischt, dr|S. Freiermuth
Polygon|R. Jakob / D. Müller
Popcorn|F. Egger
Popsong|U. Gehrig
Poseidon|St. Freiermuth
Posta, la|R. Mühlethaler
Pot Pourrythme|L. Salamin
Potom|G. Debons
Poulos|M. Emery
Power|M. Stöckli
Power-Act|A. Scheuber
Präm Pläm|H. Hediger
Primavera|R. Liechti
Primel, dr|M. Ruprecht
Prinz Carneval|P. Labhardt / Ueli 1876
Prix Garantie|U. Gehrig
Project 21|M. Heider / J. Künzle
Pulverfässli, ds|R. Müller
Puma, dr|H. Luterbacher
Pumperniggel|H. Häfelfinger
Pumuckl|I. Kym
Purzel Wichtel, dr|J. Gisel
Purzelbaum|M. Imlig
Pyo|M. Emery
Quarta-feira|D. Gachet
Quatres Jlyushins|R. Fontana
Querschleeger|A. Bachmann
Querschnitt(li)|C. Buchwalder
Quick and Slow|R. Liechti
Quick March|M. Bolt
Quick one, the|M. Imlig
Quick-Time|E. Etter
Quinqua|D. Gachet
Quintissimo|M. Imlig
Quintosa|M. Imlig
Quitte ou Double|N. Cettou
R.M.S Titanic|D. Planchon
Radac Tagwacht|F. Berger
Radang|K. Rodemerk
Radibuzz|U. Stoob
Rägetropf, dr|A. Winkler
Ragnarök|L. Chappaz
Ragtime|W. Blaser
Rambo|R. Geering
Rampli Gog|M. Hutter
Ranasca|I. Kym
Räppli|M. Regenass
Rarner|R. Fontana
Rasputin|M. Hutter
Rassli, de|U. Stoob
RasTatouille|R. Lombriser
Rat Boum|A. Petitpierre
Rätzer, dr|N. Andersen
Ravers|I. Kym
Reaper|T. Jamin
Rebal|F. Scheidegger
Régate|L. Salamin
Regimentstagwacht|A. Haefeli
Regula und Daniel|R. Barras
Remigius R., dr|A. Martin
Rencontre|Ch. Debons
Retraite 13 étoiles|arr.F. Berger
Retraite à discrétion|I. Kym
Retraite Appezöll|P. Müller
Retraite Bâloise|A. Martin
Retraite de Corée|D. Quinodoz
Retraite de Tourbillon|D. Quinodoz
Retraite Diable (H.Steffen)|H. Steffen
Retraite Diable (Häfelfinger)|H. Häfelfinger
Retraite du Bale|F. Wahl
Retraite du Hibou amoureux|M. Emery
Retraite du Rhône|N. Wasmer
Retraite einfach (F.Berger)|F. Berger
Retraite einfache (H.Suter)|H. Suter
Retraite Fantasie|arr. E. Lauener
Retraite mit Franz.Endstr.|A. Flach
Retraite TV Biel|K. Angst
Retraite-Künstlerblut|H. Schaub
Rêverie|G. Debons
Revoluzzer, d|W. Henke
Rheintaler|R. Dintheer
Rhône, le|Y. Christen
Rhonegässler|E. Jossen
Rhyblitz|R. Schlebach
Rhy-Express|I. Kym
Rhythmerica|M. Imlig
Rhythmik Defilee|R. Liechti
Rhythmixture|M. Imlig
Rhythmus|R. Grütter
Rigigässler|A. von Moos
Ring, dr|R. Di Martino
Rising Countdown|L. Kiefer
Risi-Pisi|U. Beck
Ritmica|M. Emery
Rittiner|N. Wasmer
Riviera I|R. Barras
Riviera II|R. Barras
Road Runner|S. Schwarb
Road to|N. Rey
Rochefort|L. Salamin
Rollerblades|R. Liechti
Rollercoaster|E. Schnydrig
Römer|überliefert
Rookie|Ch. Gnägi
Rotary-March|A. Frei
Rote Schwyzer|K. Kälin
Rothrister Rübli-Marsch|H. Suter
Rotse, la|D. Gachet
Rouet, le|Y. Vallotton
Roulade|J. Barras
Roulexandros|H. Straub
Roulez-Bär, dr|H. Straub
Round About|M. Imlig
Route 66|M. Zollet
R-Ouverture|B. Panchaud
Rueda|R. Di Martino
Ruesser, dr|P. Stalder
Rumpelschnitz Rag|D. Rolly
Rumpelstilzli, s|Th. Gast
Rumpel-Tagwacht|L. Künzle
Ryburger chömme, d|I. Kym
Ryburger, d|T. Börlin
S.O.S|P. Robatel
Saanedorf|W. Mösching
Sabbatical|M. Landis
Salto Mortale|T. Weggler
Salzgässler, dr|F. Wahl
Sambasia|R. Liechti
Sambera|D. Quinodoz
Sämmeli, D|A. Ehrsam
Sandmännli, s|P. Wetter
Sanitättler Adj.Hu., dr|U. Hunziker
Sans permis|N. Cuérel
Sänsemaa|R. Grieder
Säntis-Rock|M. Rossi
Satellite|D. Quinodoz
Säumling, dr|R. Lombriser
Savigny 2013|L. Frochaux
Sazerac|G. Lisser
Schaffhauser-Märsche|F. Berger
Schaman|P. Meyer
Scharlatan, dr|B. Ruf
Schärmuuser, dr|Y. Leu
Schild, le|Ch. Crausaz
Schipfa|O. Heynen
Schlag 71|U. Beck
Schlangefänger, dr|A. Grieder
Schlawiner|E. Sugiarto
Schlegubrächer, dr|M. Wasem / V. Egger
Schleusenwirbel|M. Contu, M. Zollet
Schliefer, dr|F. Wahl
Schliifer, de|R. Heim / R. Rüttimann / E. Naef
Schlitzohr, s|Ph. Müller
Schloofloos|B. Kirmess
SchmuDo|R. Di Martino
Schmuggi, dr'|S. Schwarb
Schnägä|(S. Müller) ?
Schneestock, dr|Th. Marty, L. Schnüriger
Schnoogge-Roller, dr|A. Grieder
Schnouz, d'r|R. Liechti
Schnuderi|St. Stempfel
Schollenstächer|R. Lombriser
Schoreniggeli, s'|D. Rolly
Schumbrader, il|T. Weggler
Schützenmarsch|unbekannt
Schwamedinger, dä|Th. Gast
Schweiz.-& Franz.Tagwacht|überliefert
Schwinger, dr|St. Freiermuth
Schwingfäscht|H.P. Völkle
Schwingi, dr|L. Künzle
Schwyzer Gardist|U. Blaser
Schyssdräggziigli, s'|R. Müller
Scoop|P. Thommen
Scotch Scheme|M. Imlig
Scotch Whisky|M. Hangartner
Scottish|N. Cuérel
Sedunum|M. Emery
Seebacher, de|W. Forster
Seeländer-Marsch|K. Angst sen.
Seislerbode|St. Stempfel
Seislerbueb|St. Stempfel
Semi, dr|St. Jentsch
Sempacher|überliefert
Sept épines de cactus|M. Emery
Servaz|I. Kym
Seven up|F. Egger
Seventy|W. Blaser
Sextolores|M. Hangartner
Sharky|St. Jentsch
Shere-Khan|L. Krautheim
Sheriff Bic|Th. Egli
Sherkan|J. Büschi
Sicario|S. Azzouz
Sidius|N. Cuérel
Siècle Story|B. Panchaud
Siibesiech, dr|A. Hersberger
Siidefiin|M. von Allmen
Silberpfeil|R. Di Martino
Silver Drum|C. Boss
Simon Egger-Marsch|W. Wuhrmann
Simplex|M. Emery
Since 1928|L. Chappaz
Sincero|St. Stempfel
Sinfolino|R. Liechti
Sion 1996|H. Luterbacher
Siracher, dr|Ch. Gnägi
Six Pack|B. Christen
Skyline|R. Liechti
Skywalker|R. Liechti
Slalom|J. Heldner
Slynic-hova|H.P. Völkle
Smartie, dr|A. Martin
Smiley|St. + Th. Marty
Smokey Joe|Ph. Müller
Smooth Vibrations|R. Geering
Smurfs, the|Ch. Ramo
Snakebite|M. Imlig
Snapback|T. Jamin
Snapshot|R. Liechti
Snoopy|R. Liechti
Soleil de Sierre|arr.F. Berger
Soletta|E. Blöchlinger
Solis Ortus|A. Peter
Solothurner, d'|A. Haefeli
Sonata No1|D. Kern
Sonic, dr|A. Obrist
Soundcheck|I. Kym
Souris, la|L. Künzle
Space Shuttle|St. Freiermuth
Spacewalk|R. Liechti
Spächt, dr|F. Scheidegger / H. Balmer
Spartan|N. Rey
Spassvogel|S. Freiermuth
Speedfire|U. Blaser
Spektrum|U. Gehrig / Ph. Müller
Speuzer, de|M. Baldinger / R. Käser
Spirit|R. Liechti / D. Liechti
Spitfire|L. Krautheim
Spitzbueb, dr|S. Freiermuth
Sporepeter spezial, dr|D.F. Meyer
Sporepeter, dr|D.F. Meyer
Spotlight|U. Ruoss
Spring|J.-I. Zwahlen
Sprungbrett|R. Lombriser
Spundatscha|H. Koradi
Sputim|M. Landis
Sssso|J. Ledermann
Stadt-Tambour, dr|A. Martin
Stadt-Zürcher, d|E. Schwarz
Staikohle|überliefert
Stanser Wirbelmarsch|A. Scheuber
Stänzler, d|P. Wetter
Starfighter|D. Planchon
Starlight|R. Liechti
Starline|T. Moser
Starlink|A. Gsponer
Stay Home|Ph. Müller
Steeplechase|E. Brilli
Steffisburger|überliefert
Steibiisser|M. Stämpfli
Steili Griech, dr|S. Bringolf
Steimannli|T. Bittel
Stenegge|P. Müller
Step up|F. Egger
Stettemer|W. Ostertag
Stingray|R. Geering
Stockalper|M. Juon
Storm, the|A. Hauert
Stradale|R. Betschart
Straight On|G. Wyss
Strassen Marsch|W. Eigenmann
Street Beat, dä|Th. Gast
Strike|L. Renaud
Strizzi|S. Freiermuth
Strolch, dr|C. Woodtli
Strossefäger|A. Haefeli
Strouhäumli, D's|F. Baeriswyl
Stumpe, dr|A. Soldan
Stuntman, the|P. Müller
Stürmer, dr|B. Kirmess
Subito|F. Egger
Subitolino|P. Leuzinger
Süd|St. Hösli
Sunny-Boys|A. Haefeli
Super Mario|S. Métrailler
Supernova|I. Kym
Suplementus|M. Hobi
Surrliwurm, dä|M. Krohn
Swell|L. Spescha
Swiss a Ma jig|P. Mason
Swiss Army|P. Mason
Swiss Army Beat No. 1|R. Lombriser
Swiss Made|P. Robatel
Swiss Made March|P. W. Hunziker
Swiss-Drummer|R. Liechti
SyncopAction|R. Lombriser
Synkopen-Marsch|A. Haefeli
Taguissimo|D. Planchon
Tagw.-Märsche im 2/4 Takt|unbekannt
Tagwache im 2/4 Takt|unbekannt
Tagwacht Variationen 6/8 Takt|F. Berger
Tagwacht-Märsche|F. Berger
Taifun|B. Schmid
Take Away|D. Liechti
Take Out|B. Kirmess
Take-off|B. Schmid
Talibasch|Th. Marty
Tamagotchi|F. Baeriswyl
Tambino|R. Liechti
Tambourmajor|A. Haefeli
Tambours H.M.S.|M. Emery
Tamburo Fabio|M. Emery
Tanzende Schlegel|A. Haefeli
Tarkus|P. Wirz
Tatjana|R. Liechti
Tattoo|M. Imlig
Teenager, the|I. Kym
Tellomy|M. Woodtli
Tempo 100|P. Robatel
Tempo Sereno|R. Lombriser
Tenebras|L. Chappaz
Théo et Dany|P. Burri
Thibaut|E. Heller
Three Eight Ragtime|R. Liechti
Three eight time|A. Wymann
Three Lake|A. Petitpierre
Thunder - Cloud|M. Imlig
Tibidi|M. Rossi
Ticino|R. Liechti
Tiefenrausch|P. Reichlin
Tiger, dr|H. Luterbacher
Tilt|P. Robatel
Timbalero|C. Abrecht
Time-Signatures|P. Destraz
Timing|L. Frochaux
Tinitus|A. Scheuber
Tipp-Ex|E. Etter
Tircal|R. Fontana
Tom Pouce|M. Estoppey
Tomcat|Ch. Gnägi
Tonton|P. Antonini
Top Secret|H. Wobmann/R.Lombriser
Toparay|P. Wirz
Topolino|M. Rossi
Torero|St. Freiermuth
Tornado|U. Beck
Torpedo|E. Etter
Torweg 10|S. Karlen
Tössemer-Bluet|M. Heusser
Tössemer-Frösche|M. Heusser
Tour de Sol|R. Lombriser
Tourniquet|D. Gachet
Trabi|H. Fischer
Train direct|R. Barras
Tram Cram|P. Mason
Tramontane (Ord.-Stil)|P. Wirz
Tramontane 21 (Bas.-Stil)|P. Wirz
Trans-Flon|D. Magnin
Traum Tänzer|M. Stämpfl
Tribâle|R. Liechti
Tricky|W. Kälin
Triqui|U. Wieland
Trocadero|F. Rhyn
Trois - 8|M. Emery
Trois "Bs", les|R. Lombriser
Trojaner|St. Stempfel
Trommel Fieber|U. Beck
Trommelbrüder|S. Karlen
Trommel-Evolutionen|A. Haefeli
Trommel-Kameraden|H. Krieg
Trommelmarsch 2/4 Takt|unbekannt
Trommler aus Leidenschaft|R. Barras
Trommler-Retraite|A. Haefeli
Trommler-Tagwacht|A. Haefeli
Troubadix, le|R. Lombriser
Troumba |A. Petitpierre
Tsandèlê|D. Gachet
Tschäggättä, die|R. Lombriser
Tschampämperli, dr|St. Hayoz
Tschiggodoro|D. Kern
Tschima de Flix|I. Kym
Tschinello|B. Kirmess
Tschorru|C. Summermatter
Tsèvanhyi|M. Esseiva
Tuk-Tuk-Poullouk|N. Fraternali
Tunada dal Vial|T. Weggler
Tunguska|Ch. Crausaz
Turbeau 116, le|R. Lombriser
Turbo Retraite|R. Liechti
Turbo Tagwacht|R. Liechti
Turi, dr|M. Juon
Turicum|A. Wymann
Türken|H. Fischer
Twin Spark|P. Reichlin
Twister|G. Wyss
Typhoon|Ph. Müller
Ueli, dr|P. Heitz
Uettligen 1998|A. Winkler
Un Matou chez les Dzos|St. Jeannin
Union Neuchâteloise|A. Petitpierre
Union Romande|H. Pont
Union Valaisanne|D. Quinodoz
Upgrade|M. Esseiva
Urchig, dr|J Ledermann
Urtgicla (Bas.-Stil)|R. Fontana
Urtgicla (Ord.-Stil)|R. Fontana
Ussergwöhnlich, dr|R. Müller
Ussersihler, de|W. Forster
Utopie|D. Magnin
Uuh-Aah|M. Loosli
V 15|P. Robatel
Valais|R. Liechti
Valaisia |D. Quinodoz
Valse des baguettes|R. Barras
Valse des Vignerons|D. Quinodoz
Vampire|W. Weidmann
Vanils, les|P. Wirz
Varicelle|S. Walthert
V-D 45|F. Berger
V-D 45 Roulée|F. Berger
Venezia|M. Pasquon
Vert Luciole|V. Vuilleumier
Vertigô|D. Andrey
Via Nova|L. Spescha
Vierer, dr|N. Andersen
Vierwaldstätter|A. Luterbach
Vigneronne, La|P. Wirz
Vill gfröits|M. Bolt
Villa-Marsch|F. Berger
Villarimboud 97 I|R. Barras
Villarimboud 97/II|R. Barras
Villaz-St-Pierre 1992|J. Menoud
Virtuos, dr|P. Schaub
Virtuosity|M. Imlig
Virus|R. Käser
Vision, the|St. Stempfel
Vitesse|U. Gehrig
Vitodurum|M. Heusser
Viva la vida!|B. Kirmess
Vogel, dr|St. Messmer
Voltiges|R. Barras
Vulcanus|E. Schnydrig
Vulkan|U. Beck
Vulkan|M. Juon
Wäägchnächt|St. Stempfel
Waglo|TV Lenzburg
Waidmann, dr|S. Karlen
Waldenburger, dr|F. Wahl
Wällebrächer|I. Kym
Wälleryter|U. Beck
Walliser|E. Krug
Wankdorfer|A. Haefeli
Wäntele|E. Lauener
Warm up|St. Schmocker
Wasabi|J. Büschi
Waterjet|D. Planchon
Weadargäänta, dr|R. Dintheer
Wehntalermarsch|TV-Oerlikon
Wehnthaler|H. Hediger
Wes-Kaap|A. Scheuber
Whisky-Boys|H. Krieg
White Russian|Ch. Crausaz
Wickipedia|C. Buchwalder
Wiehlmuus, d|U. Eble
Wikinger, dr|A. Frei
Wiki-Ponch|S. Walthert, L. Chappaz
Wild, aber gediegä|R. Brunschwiler
Wildcat|A. Wymann
Wildensteiner im 3/8 Takt|F. Wahl
Wildermuths|U. Hunziker
Wildhüeter, dr|U. Gehrig
Wilerbär, dr|L. Künzle
Wilerböck, d'|L. Künzle
Windredli, s'|R. Müller
Winschdi|F. Berger
Wintzer, d|J. Wintzer
Wipe out|P. Hersberger
Wipkinger, de|W. Forster
Wirbelmarsch|A. Haefeli
Wolf, dr|H. Luterbacher
Wollishofer, de|W. Forster
Wombat|O. Fischer
Wuudtschagg|B. Kirmess
www onex 150|P. Burri
Wyyberhoogge, dr|A. Berli
Xamburu|B. Kirmes
Yankee|R. Liechti
Yankee-Boys|A. Haefeli
yep|C. Heinzmann
Yes we can|W. Hagen
Ysebahn, d'|F. Berger
Ystoo|D. Rosser
Yvonand|H. Luterbacher
Yvonne|F. Tribelhorn
Zaehringia|R. Gerber
Zag-Bums|E. Hofer
Zägg, dr|Chr. Felber / S. Azzouz
Zaggebarsch|H. Blaser
Zapendui|G. Künzle
Zapfenstreichtrio|arr.F. Berger
Zauberlehrling|A. Kunz
Zentralschweizer|A. Haefeli
Zeppelin|R. Jakob / D. Müller
Zermatter|L. Zeiter
Zeus|I. Kym
Zic Zac|F. Egger
Zidderi|A. Müller
Ziger-Beat|S. Müller
Zigüner, dr|I. Kym
Zigzag|G. Metzener
Ziitreis, d'|T. Weggler
Zittertanz|L. Künzle
Zombi|M. Emery
Zug 2014|H. Luterbacher
Züghusjoggeli, dr|E. Blöchlinger
Zundelfieder, dr|D. Rolly
Züri-Genf|W. Schwarz
Zürihegeli|R. Walz
Zürileu|P. Müller
Zwasli|J. Künzle
Zwätschgeräuber|E. Sugiarto
Zwigg, dr|Ph. Haller
Zwirbel, dr|P. Schaub
Zwirbli, E|M. Imlig
Zytgeischt|A. Haefeli
"""


class Command(BaseCommand):
    help = ("Import Klakom data (hardcoded)")

    def add_arguments(self, parser):
        ...

    def handle(self, *args, **options):
        Komposition = apps.get_model("tamtour_startlistmanager", "Komposition")

        kompositionen_filtered = []

        for line in kompositionen.splitlines():
            if line:
                klakomtitel, komponist = line.split("|")

                if "," in klakomtitel:
                    first, last = klakomtitel.split(",")
                    last = last.strip()
                    titel = f"{last} {first}"
                else:
                    titel = klakomtitel

                kompositionen_filtered.append((
                    klakomtitel.strip(),
                    titel.strip(),
                    komponist.strip()
                ))

        for line in kompositionen_filtered:
            klakomtitel, titel, komponist = line
            try:
                elem, created = Komposition.objects.get_or_create(
                    klakomtitel=klakomtitel, titel=titel, komponist=komponist)
                if created:
                    self.stdout.write(self.style.SUCCESS("[CREATED]: "+str(elem)))
                else:
                    self.stdout.write(self.style.WARNING("[SKIPPED]: "+str(elem)))
            except IntegrityError:
                self.stdout.write(self.style.ERROR("[ERROR]: Already exists with same name: "+str(line)))
