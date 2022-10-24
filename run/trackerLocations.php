<?php header('Access-Control-Allow-Origin: *');

$locationsFile = "STAT/".date("Y-F-d")."_Locs.txt" ;
$locCSVFile = "STAT/locationsCSV.csv" ;
$ShortAgent = substr($_SERVER['HTTP_USER_AGENT'], 0, 33) ; 
$IPshorted = substr($_SERVER['REMOTE_ADDR'], 0, 15) ; 
$IPdateAent = " \t".date("H:i:s")."\t".date("d-F-Y")."\t".$ShortAgent."\n" ;
$forCSV = ";".$_SERVER['REMOTE_ADDR'].";".date("H:i:s").";".date("d-F-Y").";".$ShortAgent."\n" ;

if  (isset($_GET['OWN'])) {
	$s0 = $_GET['OWN'] ;
	$s1 = str_replace('W', chr(35), $s0) ;
	$str =  $IPshorted."\t"."Own\t".$s1.$IPdateAent ;
	file_put_contents($locationsFile, $str, FILE_APPEND); 
	$str =  "Own;".$s1.$forCSV ;
	file_put_contents($locCSVFile, $str, FILE_APPEND); 
}


if  (isset($_GET['LOAD'])) {
	$s0 = $_GET['LOAD'] ;
	$s1 = str_replace('W', chr(35), $s0) ;
	$str =  $IPshorted."\t"."LOA\t".$s1.$IPdateAent ;
	file_put_contents($locationsFile, $str, FILE_APPEND); 
	$str =  "LOA;".$s1.$forCSV ;
	file_put_contents($locCSVFile, $str, FILE_APPEND); 
}

?>
