<?php
namespace Phink\Utils {
    /**
    * Description of TStringUtils
    *
    * @author david
    */
    class TStringUtils
{

        public static function stringToArray($string = '', $delimiter1 = ' ', $delimiter2 = '=')
    {

            (array)$result = NULL;

            (array)$exploded = explode($delimiter1, $string);

            if($delimiter2 != '') {
                $c = count($exploded);
                for($i = 0; $i < $c; $i++) {
                    (array)$keyValue = explode($delimiter2, $exploded[$i]);
                    $result[$keyValue[0]] = $keyValue[1];
                }
            }
            else {
                $result = $exploded;
            }

            return $result;
        }

        public static function stringToDictionary($string = '')
    {
            (array)$result = NULL;

            $result = preg_split('/([-:a-z0-9]+=["a-z0-9-_]+)/i', $string, -1, PREG_SPLIT_NO_EMPTY | PREG_SPLIT_DELIM_CAPTURE | PREG_SPLIT_OFFSET_CAPTURE);

            $c = count($result);

            for($i = 0; $i < $c; $i++) {
                (array)$keyValue = explode('=', $result[$i][0]);
                $keyValue[1] = str_replace('"', '', $keyValue[1]);

                $result[$keyValue[0]] = $keyValue[1];
            }
            return $result;
        }

        public static function parameterStringToArray($string)
    {
            (array)$result = NULL;

            $string = str_replace('\"', '"', $string);
            $string = str_replace(' ', '�', $string);
            $string = str_replace('"�', '" ', $string);
            $string = str_replace('"', '', $string);

            $result = TStringUtils::stringToArray($string, ' ', '=');

            foreach($result as $key=>$value) {
                $result[$key] = str_replace('�', ' ', $value);
            }

            return $result;
        }


        public static function elementType($element)
    {
            $result = '';

            $parts = explode(' ', $element);
            $result = substr($parts[0], 1);

            return $result;

        }
        
        public static function phraseCase($string)
        {
            $upper = strtoupper($string[0]);

            return ($upper == '') ? $string : $upper . substr($string, 1);
        }

    }
}
