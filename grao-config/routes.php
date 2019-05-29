<?php 

 //========================== apiatendimento ================================ 
      Route::get('apiatendimento', [
         'as'   => 'controle.apiatendimento.index',
         'permissao' => 'controle.apiatendimento.index',
         'uses' => 'Controle\ApiAtendimentoController@index',
       ]);
       Route::get('apiatendimento/form/{id?}', [
         'as'   => 'controle.apiatendimento.form',
         'permissao' => 'controle.apiatendimento.form',
         'uses' => 'Controle\ApiAtendimentoController@form',
       ]);
       Route::post('apiatendimento/create', [
         'as'   => 'controle.apiatendimento.create',
         'permissao' => 'controle.apiatendimento.create',
         'uses' => 'Controle\ApiAtendimentoController@create',
       ]);
       Route::post('apiatendimento/update/{id}', [
         'as'   => 'controle.apiatendimento.update',
         'permissao' => 'controle.apiatendimento.update',
         'uses' => 'Controle\ApiAtendimentoController@update',
       ]);
       Route::get('apiatendimento/destroy/{id}', [
         'as'   => 'controle.apiatendimento.destroy',
         'permissao' => 'controle.apiatendimento.destroy',
         'uses' => 'Controle\ApiAtendimentoController@destroy',
       ]);