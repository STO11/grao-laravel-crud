@extends('layouts.controle')

@section('content')
    <!-- begin breadcrumb -->
    <ol class="breadcrumb pull-right">
        <li class="breadcrumb-item"><a href="javascript:;">Home</a></li>
        <li class="breadcrumb-item"><a href="javascript:;">Library</a></li>
        <li class="breadcrumb-item active"><a href="javascript:;">Data</a></li>
    </ol>
    <!-- end breadcrumb -->
    <!-- begin page-header -->
    <h1 class="page-header">Apiatendimento <small>header small text goes here...</small></h1>
    <!-- end page-header -->
    <div class="row">
        <div class="col-lg-6">
            <!-- begin panel -->
            <div class="panel panel-inverse">
                <div class="panel-heading">
                    <div class="panel-heading-btn">
                        <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default" data-click="panel-expand"><i class="fa fa-expand"></i></a>
                    </div>
                    <h4 class="panel-title">Apiatendimento</h4>
                </div>
                <div class="panel-body">
                        @if($id)
                            {!! Form::model($apiatendimento,['route' => 'controle.apiatendimento.alterar', 'files' => true]) !!}
                        @else 
                            {!! Form::model(null,['route' => 'controle.apiatendimento.cadastrar', 'files' => true]) !!}
                        @endif
                        <fieldset>
                                                                                                                                                                            
                                <div class="form-group">
                                    <label for="titulo">cliente_id*</label>
                                    {!! Form::select('cliente_id', [], null, ['class' => 'form-control', 'required']) !!}
                                </div>
                                                                                                                                                                                                                
                                <div class="form-group">
                                    <label for="titulo">cliente_login_id*</label>
                                    {!! Form::select('cliente_login_id', [], null, ['class' => 'form-control', 'required']) !!}
                                </div>
                                                                                                                                                                                                                
                                <div class="form-group">
                                    <label for="titulo">solicitacoes_id*</label>
                                    {!! Form::select('solicitacoes_id', [], null, ['class' => 'form-control', 'required']) !!}
                                </div>
                                                                                                                                                                                                                
                                <div class="form-group">
                                    <label for="titulo">grupo_usuario_id*</label>
                                    {!! Form::select('grupo_usuario_id', [], null, ['class' => 'form-control', 'required']) !!}
                                </div>
                                                                                                                                                                                                                
                                <div class="form-group">
                                    <label for="titulo">chamado_id*</label>
                                    {!! Form::select('chamado_id', [], null, ['class' => 'form-control', 'required']) !!}
                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                <div class="form-group">
                                    <label for="titulo">origem*</label>
                                    {!! Form::text('origem', null, ['class' => 'form-control', 'required']) !!}
                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                                <div class="form-group">
                                    <label for="titulo">emailheader*</label>
                                    {!! Form::textarea('emailheader',null, ['class' => 'form-control', 'required']) !!}
                                </div>
                                                                                                                                                                                                                
                                <div class="form-group">
                                    <label for="titulo">emailbody*</label>
                                    {!! Form::textarea('emailbody',null, ['class' => 'form-control', 'required']) !!}
                                </div>
                                                                                                                                                
                                <div class="form-group">
                                    <label for="titulo">emailcliente*</label>
                                    {!! Form::text('emailcliente', null, ['class' => 'form-control', 'required']) !!}
                                </div>
                                                                                                                                                                                                                
                                <div class="form-group">
                                    <label for="titulo">nomeclienteemail*</label>
                                    {!! Form::text('nomeclienteemail', null, ['class' => 'form-control', 'required']) !!}
                                </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                            
                                @if($id)
                                    @can('controle.apiatendimento.alterar')
                                        <button type="submit" class="btn btn-md btn-primary m-r-5">Salvar</button>
                                    @endcan
                                @else 
                                    @can('controle.apiatendimento.cadastrar')
                                        <button type="submit" class="btn btn-md btn-primary m-r-5">Salvar</button>
                                    @endcan
                                @endif
                            
                        </fieldset>
                    {!! Form::close() !!}

                </div> <!-- panel-body -->
                
            </div>
            <!-- end panel -->

        </div>
    </div>
    
@stop
