(function(global){
    var module = global.polylineUtil = {};
    
    module.encodeNumber = function (num) {
		var encodeString = '';
		var nextValue, finalValue;
		while (num >= 0x20) {
			nextValue = (0x20 | (num & 0x1f)) + 63;
			encodeString += (String.fromCharCode(nextValue));
			num >>= 5;
		}
		finalValue = num + 63;
		encodeString += (String.fromCharCode(finalValue));
		return encodeString;
	};
    
    module.encodeSignedNumber = function (num) {
		var sgn_num = num << 1;
		if (num < 0) {
			sgn_num = ~(sgn_num);
		}

		return this.encodeNumber(sgn_num);
	};
    
    module.getLat = function (latlng) {
		if (latlng.lat) {
			return latlng.lat;
		} else {
			return latlng[0];
		}
	};
	module.getLng = function (latlng) {
		if (latlng.lng) {
			return latlng.lng;
		} else {
			return latlng[1];
		}
	};
    
    module.encode = function (latlngs, precision) {
        var i, dlat, dlng;
        var plat = 0;
        var plng = 0;
        var encoded_points = '';

        precision = Math.pow(10, precision || 5);

        for (i = 0; i < latlngs.length; i++) {
            var lat = this.getLat(latlngs[i]);
            var lng = this.getLng(latlngs[i]);
            var latFloored = Math.floor(lat * precision);
            var lngFloored = Math.floor(lng * precision);
            dlat = latFloored - plat;
            dlng = lngFloored - plng;
            plat = latFloored;
            plng = lngFloored;
            encoded_points += this.encodeSignedNumber(dlat) + this.encodeSignedNumber(dlng);
        }
        return encoded_points;
    };
})(this);