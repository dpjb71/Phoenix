<?php

/*
 * Copyright (C) 2017 dpjb
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

namespace Phink\Web;

/**
 * Description of curl
 *
 * @author dpjb
 */
class Curl extends \Phink\Core\TStaticObject {
    //put your code here
    
    public function request($uri, $header = [], $data = []) {
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $uri);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
//            curl_setopt($ch, CURLOPT_CAINFO, $certpath);
//            curl_setopt($ch, CURLOPT_CAPATH, $certpath);
        if(count($header) > 0) {
            curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
        }
        if(count($data) > 0) {
            $queryString = http_build_query($data);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $queryString);
        }
        curl_setopt($ch, CURLINFO_HEADER_OUT, true);

        $content = curl_exec($ch);
        $error = curl_error($ch);
        $errno = curl_errno($ch);

        $info = curl_getinfo($ch);

        $header = (isset($info['request_header'])) ? $info['request_header'] : '';

        if($errno > 0) {
            throw new \Exception($error, $errno);
        }
        if($header == '') {
            throw new \Exception("Curl is not working fine for some reason. Are you using Android ?");
        }

        $code = $info['http_code'];
        curl_close($ch);

        $result = (object) ['code' => (int)$code, 'header' => $header, 'content' => $content];
        
        return $result;
    }
}