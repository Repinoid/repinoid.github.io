<?php header('Access-Control-Allow-Origin: *');

$locationsFile = "STAT/".date("Y-F-d")."_Locs.txt" ;
$locCSVFile = "STAT/locationsCSV.csv" ;
$ShortAgent = substr($_SERVER['HTTP_USER_AGENT'], 0, 33) ; 
$IPshorted = substr($_SERVER['REMOTE_ADDR'], 0, 15) ; 
$IPdateAent = " \t".date("H:i:s")."\t".date("d-F-Y")."\t".$ShortAgent."\n" ;
$forCSV = ";".$_SERVER['REMOTE_ADDR'].";".date("H:i:s").";".date("d-F-Y").";".$ShortAgent."\n" ;

if  (isset($_GET['TRK'])) {
	$str =  $IPshorted."\t"."TRK\t".$_GET['TRK'].$IPdateAent ;
	file_put_contents($locationsFile, $str, FILE_APPEND); }

if  (isset($_GET['OWN'])) {
	$str =  $IPshorted."\t"."Own\t".$_GET['OWN'].$IPdateAent ;
	file_put_contents($locationsFile, $str, FILE_APPEND); }

if  (isset($_GET['URL'])) {
	$str =  $IPshorted."\t"."URL\t".$_GET['URL'].$IPdateAent ;
	file_put_contents($locationsFile, $str, FILE_APPEND); }

if  (isset($_GET['Exact'])) {
	$str =  $IPshorted."\t"."Ext\t".$_GET['Exact'].$IPdateAent ;
	file_put_contents($locationsFile, $str, FILE_APPEND); }

if  (isset($_GET['Repeat'])) {
	$str =  $IPshorted."\t"."Rpt\t".$_GET['Repeat'].$IPdateAent ;
	file_put_contents($locationsFile, $str, FILE_APPEND); }
	
if  (isset($_GET['Coords'])) {
	$str =  $IPshorted."\t"."CRD\t".$_GET['Coords'].$IPdateAent ;
	file_put_contents($locationsFile, $str, FILE_APPEND); }
	
if  (isset($_GET['Address'])) {
	$str =  $IPshorted."\t"."ADR\t".$_GET['Address'].$IPdateAent ;
	file_put_contents($locationsFile, $str, FILE_APPEND); }

if  (isset($_GET['LOAD'])) {
	$str =  $IPshorted."\t"."LOA\t".$_GET['LOAD'].$IPdateAent ;
	file_put_contents($locationsFile, $str, FILE_APPEND); }

if  (isset($_GET['DRA'])) {
	$s0 = $_GET['DRA'] ;
	$s1 = str_replace('A', chr(35), $s0) ;
	$str =  $IPshorted."\t"."DRA\t".$s1.$IPdateAent ;
	file_put_contents($locationsFile, $str, FILE_APPEND); }

	
if  (isset($_GET['TRK'])) {
	$str =  "TRK;".$_GET['TRK'].$forCSV ;
	file_put_contents($locCSVFile, $str, FILE_APPEND); }

if  (isset($_GET['OWN'])) {
	$str =  "Own;".$_GET['OWN'].$forCSV ;
	file_put_contents($locCSVFile, $str, FILE_APPEND); }

if  (isset($_GET['URL'])) {
	$str =  "URL;".$_GET['URL'].$forCSV ;
	file_put_contents($locCSVFile, $str, FILE_APPEND); }

if  (isset($_GET['Exact'])) {
	$str =  "Ext;".$_GET['Exact'].$forCSV ;
	file_put_contents($locCSVFile, $str, FILE_APPEND); }

if  (isset($_GET['Repeat'])) {
	$str =  "Rpt;".$_GET['Repeat'].$forCSV ;
	file_put_contents($locCSVFile, $str, FILE_APPEND); }
	
if  (isset($_GET['Coords'])) {
	$str =  "CRD;".$_GET['Coords'].$forCSV ;
	file_put_contents($locCSVFile, $str, FILE_APPEND); }
	
if  (isset($_GET['Address'])) {
	$str =  "ADR;".$_GET['Address'].$forCSV ;
	file_put_contents($locCSVFile, $str, FILE_APPEND); }

if  (isset($_GET['LOAD'])) {
	$str =  "LOA;".$_GET['LOAD'].$forCSV ;
	file_put_contents($locCSVFile, $str, FILE_APPEND); }

if  (isset($_GET['DRA'])) {
	$s0 = $_GET['DRA'] ;
	$s1 = str_replace('A', chr(35), $s0) ;
	$str =  "DRA;".$s1.$forCSV ;
	file_put_contents($locCSVFile, $str, FILE_APPEND); }

?>
