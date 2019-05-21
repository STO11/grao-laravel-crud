<?php

namespace App\Http\Controllers\Controle;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Apiatendimento;

class ApiatendimentoController extends Controller
{
    public function index()
    {	
    	$data = ['apiatendimentos'];
    	$apiatendimentos = Banner::orderBy('id', 'desc')->get();
    	return view('controle.apiatendimentos.index', compact($data));
    }

    public function form($id = null)
    {
    	$data = ['apiatendimento', 'id'];
    	$apiatendimento = Apiatendimento::find($id);
    	return view('controle.apiatendimentos.form', compact($data));
    }

    public function cadastrar(Request $request)
    {
    	$input = $request->except('_token');
        $apiatendimento = Apiatendimento::create($input);
        if ($apiatendimento) 
        {
           return redirect()
                ->route('controle.apiatendimentos.index')
    			->with('msg', 'Cadastrado com sucesso.')
    			->with('error', false);
    	}
        return redirect()
            ->route('controle.apiatendimento.form')
    		->with('msg', 'Falha na operação.')
            ->with('error', true)
            ->withInput();
    }

    public function alterar(Request $request, $id)
    {
    	$input = $request->except('_token', 'imagem');
        $apiatendimento = Apiatendimento::find($id);
        if ($apiatendimento) 
        {
            if($apiatendimento->update($input))
            {
                return redirect()
                ->route('controle.apiatendimentos.index')
    			->with('msg', 'Atualizado com sucesso.')
    			->with('error', false);
    		}
            return redirect()
                ->route('controle.apiatendimentos.form')
                ->with('msg', 'Falha na operação.')
                ->with('error', true)->withInput();
    	}
        return redirect()
            ->route('controle.apiatendimentos.form')
    		->with('msg', 'Falha na operação.')
    		->with('error', true)->withInput();
    }

    public function excluir($id)
    {
    	$apiatendimento = Banner::find($id);
        if ($apiatendimento) 
        {
    		$apiatendimento->delete();
            return redirect()
                ->route('controle.apiatendimentos.index')
    			->with('msg', 'Deletado com sucesso.')
    			->with('error', false);
    	}
        return redirect()
            ->route('controle.apiatendimentos.index')
    		->with('msg', 'Falha na operação.')
    		->with('error', true);
    }


}
