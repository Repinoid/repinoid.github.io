<?php header('Access-Control-Allow-Origin: *');

$locationsFile = "../STAT/L_".date("Y-F-d").".txt" ;

$H=getenv("HTTP_REFERER");
$ShortAgent = substr($_SERVER['HTTP_USER_AGENT'], 0, 33) ; 
$ShortIP = substr($_SERVER['REMOTE_ADDR'], 0, 15) ;
$IPdateAent = "\t".date("H:i:s")."\t".date("d-F-Y")."\t".$ShortAgent ;


if  (isset($_GET['OWN'])) {
	$str = $ShortIP."\tOwn: ".$_GET['OWN']."\t".$IPdateAent."\n" ;
	file_put_contents($locationsFile, $str, FILE_APPEND); }

?>
