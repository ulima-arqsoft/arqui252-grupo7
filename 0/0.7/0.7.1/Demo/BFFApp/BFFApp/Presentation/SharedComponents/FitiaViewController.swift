//
//  FitiaViewController.swift
//  Fitia
//
//  Created by Ken Wakabayashi on 2/07/25.
//  Copyright ©️ 2025 Ulises Olave mendoza. All rights reserved.
//

import UIKit
import SwiftUI

class FitiaViewController<Content: View, VM: FitiaViewModel>: UIHostingController<Content> {
    
    var viewModel: VM?
    
    // MARK: - Lifecycle
    
    override func loadView() {
        super.loadView()
        viewModel?.loadView()
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        hideNavigationBar()
        viewModel?.viewDidLoad()
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        viewModel?.viewWillAppear()

    }

    override func viewWillLayoutSubviews() {
        super.viewWillLayoutSubviews()
        viewModel?.viewWillLayoutSubviews()
    }

    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        viewModel?.viewDidLayoutSubviews()
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        viewModel?.viewDidAppear()
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        viewModel?.viewWillDisappear()

        if self.isMovingFromParent {
            viewModel?.viewWillPop()
        }
    }

    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        viewModel?.viewDidDisappear()
        
        if self.isMovingFromParent {
            viewModel?.viewDidPop()
        }
    }
    
    deinit {
        print("☠️ FitiaViewController deinit")
    }
    
    // MARK: - Helpers
    
    // Para los sheets, utilizar el Modifier .measuringSize
    // y llamar estea funcion desde el viewDidLayoutSubviews    
    // Retorna si se ha seteado
    @discardableResult
    func configureSheetPresentation(height: CGFloat, detents: [UISheetPresentationController.Detent] = [], shouldAnimate: Bool = true) -> Bool {
        guard let sheet = sheetPresentationController else { return false }
        sheet.prefersGrabberVisible = true
        sheet.preferredCornerRadius = 20
        
        let maxHeight = sheet.frameOfPresentedViewInContainerView.height
        let contentHeight: CGFloat = min(height, maxHeight)
        
        let customDetent = UISheetPresentationController.Detent.custom(identifier: .init("custom")) { _ in
            return contentHeight
        }
        
        let finalDetents = [customDetent] + detents
        
        if shouldAnimate {
            sheet.animateChanges {
                sheet.detents = finalDetents
            }
        } else {
            sheet.detents = finalDetents
        }
        
        return true
    }
    
    
    
    func setEndEditing() {
        let screenTapGesture = UITapGestureRecognizer(target: self, action: #selector(viewTapped(_:)))
        screenTapGesture.cancelsTouchesInView = false
        view.addGestureRecognizer(screenTapGesture)
    }
    
    @objc func viewTapped(_ sender: UITapGestureRecognizer) {
        view.endEditing(true)
    }
    
    func hideNavigationBar() {
        navigationController?.setNavigationBarHidden(true, animated: true)
    }
}
