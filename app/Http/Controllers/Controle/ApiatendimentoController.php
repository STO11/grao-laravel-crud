<?php

namespace App\Http\Controllers\Controle;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\ApiAtendimento;

class ApiAtendimentoController extends Controller
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
    	$apiatendimento = ApiAtendimento::find($id);
    	return view('controle.apiatendimentos.form', compact($data));
    }

    public function create(Request $request)
    {
    	$input = $request->except('_token');
        $apiatendimento = ApiAtendimento::create($input);
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

    public function update(Request $request, $id)
    {
    	$input = $request->except('_token', 'imagem');
        $apiatendimento = ApiAtendimento::find($id);
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

    public function destroy($id)
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
