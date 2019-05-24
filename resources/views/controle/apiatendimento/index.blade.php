@extends('layouts.controle')
@section('content')
<table>
    <thead>
            <th>id</th>
            <th>cliente_id</th>
            <th>cliente_login_id</th>
            <th>solicitacoes_id</th>
            <th>grupo_usuario_id</th>
            <th>chamado_id</th>
            <th>atendido</th>
            <th>novo</th>
            <th>active</th>
            <th>atendimento</th>
            <th>origem</th>
            <th>lido</th>
            <th>transferido</th>
            <th>emailheader</th>
            <th>emailbody</th>
            <th>emailcliente</th>
            <th>nomeclienteemail</th>
            <th>created_at</th>
            <th>updated_at</th>
            <th>deleted_at</th>
            <th>Opções</th>
    </thead>
    <tbody>
    <tr>
            <td>{{ apiatendimento->id}}</td>
            <td>{{ apiatendimento->cliente_id}}</td>
            <td>{{ apiatendimento->cliente_login_id}}</td>
            <td>{{ apiatendimento->solicitacoes_id}}</td>
            <td>{{ apiatendimento->grupo_usuario_id}}</td>
            <td>{{ apiatendimento->chamado_id}}</td>
            <td>{{ apiatendimento->atendido}}</td>
            <td>{{ apiatendimento->novo}}</td>
            <td>{{ apiatendimento->active}}</td>
            <td>{{ apiatendimento->atendimento}}</td>
            <td>{{ apiatendimento->origem}}</td>
            <td>{{ apiatendimento->lido}}</td>
            <td>{{ apiatendimento->transferido}}</td>
            <td>{{ apiatendimento->emailheader}}</td>
            <td>{{ apiatendimento->emailbody}}</td>
            <td>{{ apiatendimento->emailcliente}}</td>
            <td>{{ apiatendimento->nomeclienteemail}}</td>
            <td>{{ apiatendimento->created_at}}</td>
            <td>{{ apiatendimento->updated_at}}</td>
            <td>{{ apiatendimento->deleted_at}}</td>
            <td>
                <a href="{{ route('controle.apiatendimento.alterar') }}">Alterar</a>
                <a href="{{ route('controle.apiatendimento.excluir') }}">Excluir</a>
            </td>
    </tr>
    </tbody>
</table>
@stop