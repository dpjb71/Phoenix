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
 
 
namespace Phink\Data;
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author david
 */
interface IDataStatement {
    public function fetch(int $mode) : ?array;
    public function fetchAll(int $mode) : ?array;
    public function fetchObject() : ?object;
    public function getFieldCount() : ?int;
    public function getRowCount() : ?int;
    public function getFieldName(int $i) : string;
    public function getFieldType(int $i) : string;
    public function getFieldLen(int $i) : int;
}
?>
