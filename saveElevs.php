<?php header('Access-Control-Allow-Origin: *');
	
	$papka = "WTP/Elevs/" ;						// output directory
	
	$InPutData = fopen("php://input", "r");
	if ($InPutData == false)
		exit(1) ;
	
	$buf = fread($InPutData, 1024) ;			// read first block with file name for output
	if ($buf == false)
		exit(2) ;

	$pos = strpos($buf, ".json");				// find position of ".json"
	if ($pos == false)							// if no ".json"
		exit(3) ;
	
	$fnam = $papka.substr($buf, 0, $pos + 5) ; 		// file name for output; 5 - ".json" lenght
	
	$fp = fopen($fnam, "x");					// open file for output, X - no rewrite
	if ($fp == false)							// if out file opening error
		exit(4) ;
	
	$rest = substr($buf, $pos + 5) ; 	// остаток строки, без имени файла
	fwrite($fp, $rest);
		
	while ($data = fread($InPutData, 1024)) // запись в файл
		fwrite($fp, $data);

	fclose($fp);
	fclose($InPutData);
	
?>
