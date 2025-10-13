//
//  LastOrders.swift
//  Loop
//
//  Created by Kohji Onaja on 05/08/25.
//

import SwiftUI

struct LastOrders: View {
    var body: some View {
        VStack {
            Text("Últimos pedidos")
                .font(.system(size: 20, weight: .bold))
                .frame(maxWidth: .infinity, alignment: .leading)
            Text("Sin órdenes recientes")
                .font(.system(size: 12, weight: .regular))
                .padding(.vertical, 30)
                .frame(maxWidth: .infinity)
                .background(.gray.opacity(0.1))
                .cornerRadius(10)
        }
    }
}

#Preview {
    LastOrders()
}
