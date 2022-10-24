function  Rad(x) {
            return x * Math.PI / 180;

}

function SunPos(
            Point, 
            Year,//год
            Mon,// месяцы
            Day,// дни
            hous,//часы
            min,//минуты
            sec,// секунды
            zona// Часовой пояс
           )
{
	lat = Point.location.lat() ;
	lng = Point.location.lng() ;
	
            //1.Вычисление модифицированной  юлианской даты на начало суток

            var Var1, Var2, Var3;
            Var1 = 10000 * Year + 100 * Mon + Day;
            if (Mon <= 2)
            {
                Mon = Mon + 12;
                Year = Year - 1;
            }
            if (Var1 <= 15821004) 
				Var2 = -2 + Math.floor((Year + 4716) / 4) - 1179;
            else 
				Var2 = Math.floor(Year / 400) - Math.floor(Year / 100) + Math.floor(Year / 4);
            
			Var3 = 365 * Year - 679004;
            // MJD - Модифицированная Юлианская дата
            var MJD = Var3 + Var2 + Math.floor(306001 * (Mon + 1) / 10000) + Day;


            // Вычисление Гринвеческого звездного времени

            var T0 = (MJD - 51544.5) / 36525; // мод.юл.дата на начало суток в юлианских столетиях
            var a1 = 24110.54841;
            var a2 = 8640184.812;
            var a3 = 0.093104;
            var a4 = 0.0000062;
            var S0 = a1 + a2 * T0 + a3 * T0 * T0 - a4 * T0 * T0 * T0;// звездное время в Гринвиче на начало суток в секундах
            //UT - всемирное время в часах, момент расчета
            var UT = hous - zona + min / 60 + sec / 3600;
			
            if (UT > 24) 
				UT = UT - 24;
            if (UT < 0) 
				UT = UT + 24;
			
            var Nsec = UT * 3600; // количество секунд, прошедших  от начала суток до момента наблюдения

            var NsecS = Nsec * 366.2422 / 365.2422; //количество  звездных секунд
            var  GMT = (S0 + NsecS) / 3600 * 15;//гринвическое среднее звездное время в градусах SG
			
			GMT = GMT % 360 ;
            var GST = GMT + lng;// местное звездное время ST
            //Lng – долгота наблюдателя


            //  Вычисление эклиптических координат Солнца

            T0 = (MJD - 51544.5) / 36525; // мод.юл.дата на начало суток в юлианских столетиях
            var M = 357.528 + 35999.05 * T0 + 0.04107 * UT;// средняя аномалия
			M = M % 360 ;
			
			var L0 = 280.46 + 36000.772 * T0 + 0.04107 * UT;
            var L = L0 + (1.915 - 0.0048 * T0) * Math.sin(Rad(M)) + 0.02 * Math.sin(Rad(2 * M));//долгота Солнца
			L = L % 360 ;

            var X = Math.cos(Rad(L)); // вектор
            var Y = Math.sin(Rad(L)); //  в эклиптической
            var Z = 0; //  системе координат

            // Координаты Cолнца в прямоугольной экваториальной системе координат

            var Eps = 23.439281; //наклон эклиптики к экватору
            var X_ = X;                          // вектор
            var Y_ = Y * Math.cos(Rad(Eps)) - Z * Math.sin(Rad(Eps)); //   в экваториальной
            var Z_ = Y * Math.sin(Rad(Eps)) + Z * Math.cos(Rad(Eps));//    системе координат


            // Экваториальные геоцентрические координаты Солнца
            // RA - прямое восхождение Солнца на нужный момент времени
            //DEC - склонение Солнца на нужный момент времени

            var Ra = Math.atan2(Y_, X_) * 180 / Math.PI;
            var Dec = Math.atan2(Z_, Math.sqrt(X_ * X_ + Y_ * Y_)) * 180 / Math.PI;

            //  Азимутальные координаты Солнца


            //Lat - широта

            var Th = (GST - Ra) % 360;//часовой угол
            var z = Math.acos(Math.sin(Rad(lat)) * Math.sin(Rad(Dec)) + Math.cos(Rad(lat)) * Math.cos(Rad(Dec)) * Math.cos(Rad(Th))) * 180 / Math.PI;// косинус зенитного угла
            var H = 90 - z;
            var Az = Math.atan2(Math.sin(Rad(Th)) * Math.cos(Rad(Dec)) * Math.cos(Rad(lat)), Math.sin(Rad(H)) * Math.sin(Rad(lat)) - Math.sin(Rad(Dec))) * 180 / Math.PI;

            // получаем подсолнечную точку
            // Долгота Солнца
            LonSan = Ra - GST;
            // Широта Солнца
            LatSan = Dec;
			
			var tanOfDec = Z_ / Math.sqrt(X_ * X_ + Y_ * Y_) ;			// тангенс склонения

			
			var chU = Math.acos( -Math.tan(Rad(lat)) * tanOfDec ) * 180 / Math.PI ; 
			
			var ppp = ( Math.sin(Rad(-0.83)) - Math.sin(Rad(lat)) * Math.sin(Rad(Dec)) ) / ( Math.cos(Rad(lat)) * Math.cos(Rad(Dec)) ) ;
			chU = Math.acos(ppp) * 180 / Math.PI ;
			
			
			return { azzy: Az, nad: H, chU: chU/15 }
}

        

















