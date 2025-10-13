//
//  LoginViewModel+Interactions.swift
//  Loop
//
//  Created by Kohji Onaja on 25/08/25.
//

import GoogleSignIn
import AuthenticationServices

extension LoginViewModel {
    
    func onLoginButtonTapped() {
        isLoading = true
        Task {
            await useCases.loginUseCase.execute()
            isLoading = false
            router?.dismissSheet()
        }
    }
    
    func onLoginWithGoogleButtonTapped() {
        if let rootViewController = UIApplication.shared.getRootViewController() {
            GIDSignIn.sharedInstance.signIn(withPresenting: rootViewController) { [weak self] result, error in
                guard let user = result?.user else { return }
                self?.isLoading = true
    //            DispatchQueue.main.async { self?.showLoader() }
    //            self?.interactor.doSignUpWithGoogle(request: SignUpScene.SignUpWithGoogle.Request(
    //                googleUser: user
    //            ))
            }
        }
    }
}
