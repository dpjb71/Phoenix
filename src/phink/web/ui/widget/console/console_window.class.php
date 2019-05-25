<?php

namespace Phink\Web\UI\Widget\ConsoleWindow;

//require_once 'phink/mvc/partial_controller.php';

use Phink\MVC\TPartialController;

/**
 * Description of dummy
 *
 * @author david
 */


class TConsoleWindow extends TPartialController
{
    protected $text = "Unknown command";
    protected $args = '';
 
    public function afterBinding() :void
    {
        $cmd = isset($this->parameters['console']) ? $this->parameters['console'] : '';
        $arg = isset($this->parameters['arg']) ? $this->parameters['arg'] : null;

        $this->setArgs($this->parameters);

        $this->commandRunner($cmd, function ($data) {
            $this->setText($data);
        }, $arg);
    }

    public function setArgs($value) : void
    {
        $this->args = $value;
        if (is_array($value)) {
            $this->args = print_r($value, true);
        }
    }

    public function getArgs() : array
    {
        return $this->args;
    }
    
    public function setText($value) : void
    {
        $this->text = $value;
        if (is_array($value)) {
            $this->text = print_r($value, true);
        }
    }
    
    public function getText() : string
    {
        return $this->text;
    }

    public function commandRunner(string $cmd, callable $callback, ...$args) : void
    {
        if (isset($this->commands[$cmd])) {
            $cmd = $this->commands[$cmd];
            $statement = $cmd['callback'];

            if ($statement !== null && count($args) === 0) {
                call_user_func($statement, $callback);
            } elseif ($statement !== null && count($args) > 0) {
                call_user_func($statement, $callback, $args);
            }
        }
    }
}