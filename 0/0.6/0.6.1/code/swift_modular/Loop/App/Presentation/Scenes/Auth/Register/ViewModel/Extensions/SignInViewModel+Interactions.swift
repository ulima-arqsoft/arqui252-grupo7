//
//  SignInViewModel+Interactions.swift
//  Loop
//
//  Created by Kohji Onaja on 25/08/25.
//

import GoogleSignIn
import AuthenticationServices
import FirebaseAuth

extension SignInViewModel {
    
    func onLoginButtonTapped() {
        isLoading = true
        Task {
            isLoading = false
            router?.dismissSheet()
        }
    }
    
    func onRegisterWithGoogleButtonTapped() {
        Task {
            do {
                try await useCases.signInWithGoogleUseCase.execute()
                router?.dismissSheet()
            } catch {
                
            }
        }
    }
}
