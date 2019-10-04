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
 
 namespace Phink\MVC;

use Phink\Core\IObject;
use Phink\Web\IWebObject;
use Phink\MVC\TPartialView;
use Phink\MVC\TCustomController;

class TPartialController extends TCustomController 
{
    
    public function __construct(IWebObject $parent)
    {
        parent::__construct($parent);
        
        $this->className = $this->getType();
        $this->viewName = lcfirst($this->className);
       
        list($file, $type, $code) = \Phink\TAutoloader::includeModelByName($this->viewName);
        $modelClass = $type;
        $this->model = new $modelClass();        
        $this->view = new TPartialView($parent, $this); 
    }   
    
    public function render() : void
    {
        $this->init();
        $this->parse();
        $this->beforeBinding();
        $this->renderCreations();
        $this->renderDeclarations();
        $this->afterBinding();
        $this->renderView();
        if(!$this->isRendered) {
            $this->renderHtml();
            $this->renderedHtml();
        }
        $this->unload();    
    }    
    
    public function __destruct()
    {
        unset($this->model);
        unset($this->view);
    }
    
}
