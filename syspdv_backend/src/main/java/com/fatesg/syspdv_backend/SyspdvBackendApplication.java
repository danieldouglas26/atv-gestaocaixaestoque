package com.fatesg.syspdv_backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.fatesg.syspdv_backend.model.PerfilUsuario;
import com.fatesg.syspdv_backend.model.StatusUsuario;
import com.fatesg.syspdv_backend.model.Usuario;
import com.fatesg.syspdv_backend.repository.UsuarioRepository;

@SpringBootApplication
public class SyspdvBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(SyspdvBackendApplication.class, args);
    }

    @Bean
    CommandLineRunner initData(UsuarioRepository usuarioRepository) {
        return args -> {
	           if (usuarioRepository.count() == 0) {
                
                Usuario admin = new Usuario();
                admin.setNomeCompleto("Administrador");
                admin.setEmail("admin@syspdv.com");
                admin.setSenha("Admin123"); 
                admin.setPerfil(PerfilUsuario.ADMIN);
                admin.setStatus(StatusUsuario.ATIVO);
                
                usuarioRepository.save(admin);
                
                System.out.println("------------------------------------------------");
                System.out.println(" USUÁRIO ADMINCRIADO COM SUCESSO");
                System.out.println(" E-mail: admin@syspdv.com");
                System.out.println(" Senha:  Admin123");
                System.out.println("------------------------------------------------");
                
                // Operador para testes rápidos
                Usuario operador = new Usuario();
                operador.setNomeCompleto("Operador de Caixa");
                operador.setEmail("operador@syspdv.com");
                operador.setSenha("Operador123");
                operador.setPerfil(PerfilUsuario.OPERADOR);
                operador.setStatus(StatusUsuario.ATIVO);
                
                usuarioRepository.save(operador);
            }
        };
    }
}