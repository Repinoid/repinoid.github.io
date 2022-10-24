<?php header('Access-Control-Allow-Origin: *');

$locationsFile = "WTP/STAT/locos.txt" ;
$statusFile = "WTP/STAT/status.txt" ;
$enterFile = "WTP/STAT/enters.txt" ;
$enter2IndexFile = "WTP/STAT/enter2Index.txt" ;


$ShortAgent = substr($_SERVER['HTTP_USER_AGENT'], 0, 33) ; 
$IPdateAent = "    \t".$_SERVER['REMOTE_ADDR']."\t\t".date("H:i:s")."\t".date("d-F-Y")."\t".$ShortAgent ;

if  (isset($_GET['Enter'])) {
	$str =  "\n\t".$IPdateAent."\t".$_SERVER['HTTP_REFERER'] ;
	file_put_contents($enterFile, $str, FILE_APPEND); }

if  (isset($_GET['Enter2Index'])) {
	$str =  "\n\t".$IPdateAent."\t".$_SERVER['HTTP_REFERER'] ;
	file_put_contents($enter2IndexFile, $str, FILE_APPEND); }

if  (isset($_GET['OWN'])) {
	$str =  "\nOwn:        \t".$_GET['OWN'].$IPdateAent ;
	file_put_contents($locationsFile, $str, FILE_APPEND); }

if  (isset($_GET['URL'])) {
	$str =  "\nURL:        \t".$_GET['URL'].$IPdateAent ;
	file_put_contents($locationsFile, $str, FILE_APPEND); }
	
if  (isset($_GET['Coords'])) {
	$str =  "\nCoords:     \t".$_GET['Coords'].$IPdateAent ;
	file_put_contents($locationsFile, $str, FILE_APPEND); }
	
if  (isset($_GET['Address'])) {
	$str =  "\nAddress:    \t".$_GET['Address'].$IPdateAent ;
	file_put_contents($locationsFile, $str, FILE_APPEND); }

if  (isset($_GET['Status'])) {
	$str =  "\nStatus:\t".$_GET['Status']."\t".$_SERVER['REMOTE_ADDR'] ;
	file_put_contents($statusFile, $str, FILE_APPEND); }
?>
