<?php
/*
 * Copyright (C) 2016 David Blanchard
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
 
 
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Phink\UI;

class TConsole extends \Phink\Core\TStaticObject
{

    private static function _write($string, ...$params)
    {
        
        $result = $string;
        if(count($params) > 0 && is_array($params[0])) {
            $result = vsprintf($string, $params[0]);
        }
        return $result;
        
    }


    public static function write($string, ...$params)
    {
        $result = self::_write($string, $params);
        if(DOCUMENT_ROOT == '') {
            print $result;
        } else {
            self::getLogger()->debug($result);
        }
    }
    
    public static function writeLine($string, ...$params)
    {
        $result = self::_write($string, $params);
        if(DOCUMENT_ROOT == '') {
            print $result . PHP_EOL;
        } else {
            self::getLogger()->debug($result) . PHP_EOL;
        }
    }

    
}