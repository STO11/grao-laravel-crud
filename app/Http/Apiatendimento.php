<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ApiAtendimento extends Model
{
    use SoftDeletes;
    
    protected $fillable = ['cliente_id','cliente_login_id','solicitacoes_id','grupo_usuario_id','chamado_id','atendido','novo','active','atendimento','origem','lido','transferido','emailheader','emailbody','emailcliente','nomeclienteemail','created_at','updated_at','deleted_at'];

}
