//
//  LoginView.swift
//  Loop
//
//  Created by Kohji Onaja on 25/08/25.
//

import SwiftUI

struct SignInView: View {
    @ObservedObject var viewModel: SignInViewModel
    @Environment(\.dismiss) var dismiss
    var body: some View {
        VStack {
            Text("Crea cuenta Loop")
                .font(.system(size: 20, weight: .semibold))
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.top, 70)
        
            VStack {
                TextField("Nombre", text: $viewModel.email)
                    .frame(maxWidth: .infinity)
                Rectangle()
                    .fill(.secondary)
                    .frame(height: 1.5)
            }
            .padding(.vertical)
            
            VStack {
                TextField("Correo", text: $viewModel.email)
                    .frame(maxWidth: .infinity)
                Rectangle()
                    .fill(.secondary)
                    .frame(height: 1.5)
            }
            .padding(.vertical)
            .padding(.bottom)
            
            VStack {
                Group {
                    if viewModel.isPasswordhidden {
                        SecureField("Contraseña", text: $viewModel.password)
                            .frame(maxWidth: .infinity)
                    } else {
                        TextField("Contraseña", text: $viewModel.password)
                            .frame(maxWidth: .infinity)
                    }
                }
                .overlay(alignment: .trailing) {
                    Button(action: {
                        viewModel.isPasswordhidden.toggle()
                    }) {
                        Image(viewModel.isPasswordhidden ? "ic_eye" : "ic_eye_off")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 20, height: 20)
                    }
                }
                Rectangle()
                    .fill(.secondary)
                    .frame(height: 1.5)
            }
            .padding(.bottom)
            
            LoopButton(text: "Continuar",onTapButton: viewModel.onLoginButtonTapped)
                .setIsLoading(viewModel.isLoading)
   
            HStack {
                Rectangle()
                    .frame(height: 1)
                Text("o")
                    .font(.system(size: 20, weight: .regular))
                    .padding(.horizontal)
                Rectangle()
                    .frame(height: 1)
            }
            .padding(.vertical)
            
            LoopButton(
                text: "Continuar con Google",
                iconType: .customView(
                    Image("ic_google")
                        .resizable()
                        .scaledToFit()
                ),
                onTapButton: viewModel.onRegisterWithGoogleButtonTapped
            )
            .backgroundColor(.clear)
            .foregroundColor(light: .black, dark: .white)
            .borderColor(light: .black, dark: .white)
            
        }
        .padding(.horizontal)
        .frame(maxWidth: .infinity)
        .background()
        .overlay(alignment: .top){
            HStack {
                Button(action: {
                    dismiss()
                }) {
                    Image(systemName: "xmark")
                        .resizable()
                        .scaledToFit()
                        .foregroundColor(.black)
                        .frame(width: 15, height: 15)
                }
                Spacer()
                Text("Bienvenido")
                    .font(.system(size: 20, weight: .medium))
                Spacer()
            }
            .padding(.horizontal)
            .padding(.top, 15)
        }
    }
}

#Preview {
    NavigatableView { router in
        Text("Login")
            .onAppear {
                router?.showCustomSheet(.automatic, onDismiss: nil) { router in
                    SignInBuilder.build()
                }
            }
        
    }
    .environmentObject(AppContainer())
}
