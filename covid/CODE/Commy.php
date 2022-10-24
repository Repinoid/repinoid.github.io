<?php header('Access-Control-Allow-Origin: *');
$commyFile = "../STAT/comments_".date("Y-F-d").".txt" ;
$ShortAgent = substr($_SERVER['HTTP_USER_AGENT'], 0, 33) ; 
$IPdateAent = $_SERVER['REMOTE_ADDR']."\t".date("H:i:s")."\t".date("d-F-Y")."\t".$ShortAgent ;
if ( isset($_GET['comment']) ){
	$str =  $IPdateAent."\n".$_GET['comment']."\n" ;
	file_put_contents($commyFile, $str, FILE_APPEND); 
}
?>
