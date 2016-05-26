<?php

namespace Phink\Data\Client\SQLite;

//require_once 'phink/data/data_reader.php';
//require_once 'phink/core/aobject.php';

use Phink\Core\TObject;
use Phink\Data\IDataReader;

/**
 * Description of adatareader
 *
 * @author david
 */
class TSqliteDataReader extends TObject implements IDataReader
{

    private $_result;
    private $_values;

    public function __construct($result)
    {
        $this->_result = $result;
    }

    public function values($i)
    {
        return $this->_values[$i];
    }

    public function read()
    {
        $this->_values = $this->_result->fetchArray();
        if($this->_values > 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
}
?>
