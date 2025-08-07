
document.addEventListener('DOMContentLoaded', () => {
    const initializePaymentForm = (formId, options) => {
        const form = document.getElementById(formId);
        if (!form) return;

        const {
            amountButtonsSelector,
            customAmountInputId,
            nameInputId,
            emailInputId,
            phoneInputId,
            addressInputId,
            panInputId,
            purposeInputId,
            anonymousCheckboxId,
            membershipTypeSelectId,
            photoInputId,
            getAmountAndPurpose,
            getPrefill,
            getNotes,
            onSuccess,
            validateForm
        } = options;

        const amountButtons = document.querySelectorAll(amountButtonsSelector);
        const customAmountInput = document.getElementById(customAmountInputId);

        if (amountButtons.length > 0 && customAmountInput) {
            amountButtons.forEach(button => {
                button.addEventListener('click', () => {
                    amountButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    customAmountInput.value = '';
                    clearError(customAmountInput);
                });
            });

            customAmountInput.addEventListener('input', () => {
                amountButtons.forEach(btn => btn.classList.remove('active'));
            });
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (validateForm && !validateForm()) {
                showToast(languages[document.documentElement.lang].pleaseCorrectErrors, 'error');
                return;
            }

            const { amount, purpose } = getAmountAndPurpose();
            const prefill = getPrefill();
            const notes = getNotes();

            if (amount <= 0) {
                showToast('Please enter a valid amount.', 'error');
                return;
            }

            const razorpayOptions = {
                key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your actual Razorpay Key ID
                amount: amount * 100,
                currency: 'INR',
                name: 'Nav Yug Nirman Foundation',
                description: purpose,
                image: 'assets/images/logo.png',
                order_id: 'order_' + Date.now(), // Replace with a dynamically generated order ID from your backend
                handler: function (response) {
                    const transaction = {
                        id: 'txn_' + Date.now(),
                        paymentId: response.razorpay_payment_id,
                        orderId: response.razorpay_order_id,
                        signature: response.razorpay_signature,
                        status: 'success',
                        date: new Date().toISOString(),
                        amount: amount,
                        purpose: purpose,
                        ...prefill,
                        ...notes
                    };
                    saveTransaction(transaction);
                    showToast(languages[document.documentElement.lang].paymentSuccessful, 'success');
                    onSuccess(transaction);
                    form.reset();
                    if (amountButtons.length > 0) {
                        amountButtons.forEach(btn => btn.classList.remove('active'));
                    }
                },
                prefill: prefill,
                notes: notes,
                theme: {
                    color: '#FFA500'
                }
            };

            const rzp = new Razorpay(razorpayOptions);
            rzp.on('payment.failed', function (response) {
                const transaction = {
                    id: 'txn_' + Date.now(),
                    paymentId: response.error.metadata.payment_id,
                    orderId: response.error.metadata.order_id,
                    status: 'failed',
                    date: new Date().toISOString(),
                    amount: amount,
                    purpose: purpose,
                    ...prefill,
                    ...notes,
                    error: response.error.description
                };
                saveTransaction(transaction);
                showToast(languages[document.documentElement.lang].paymentFailed + ': ' + response.error.description, 'error');
            });
            rzp.open();
        });
    };

    // Donation Form
    initializePaymentForm('donation-form', {
        amountButtonsSelector: '.btn-amount',
        customAmountInputId: 'custom-amount',
        nameInputId: 'donor-name',
        emailInputId: 'donor-email',
        phoneInputId: 'donor-phone',
        addressInputId: 'donor-address',
        panInputId: 'donor-pan',
        purposeInputId: 'donation-purpose',
        anonymousCheckboxId: 'anonymous-donation',
        getAmountAndPurpose: () => {
            const customAmountInput = document.getElementById('custom-amount');
            const selectedAmountButton = document.querySelector('.btn-amount.active');
            const amount = parseFloat(customAmountInput.value || (selectedAmountButton ? selectedAmountButton.dataset.amount : 0));
            const purpose = document.getElementById('donation-purpose').value || 'Donation';
            return { amount, purpose };
        },
        getPrefill: () => {
            const isAnonymous = document.getElementById('anonymous-donation').checked;
            return {
                name: isAnonymous ? 'Anonymous' : document.getElementById('donor-name').value,
                email: isAnonymous ? 'anonymous@example.com' : document.getElementById('donor-email').value,
                contact: isAnonymous ? '' : document.getElementById('donor-phone').value
            };
        },
        getNotes: () => {
            const isAnonymous = document.getElementById('anonymous-donation').checked;
            return {
                address: isAnonymous ? '' : document.getElementById('donor-address').value,
                pan: isAnonymous ? '' : document.getElementById('donor-pan').value,
                anonymous: isAnonymous ? 'Yes' : 'No'
            };
        },
        onSuccess: (transaction) => {
            // Populate and show receipt download button
            document.getElementById('receipt-no').textContent = transaction.id;
            document.getElementById('receipt-date').textContent = new Date(transaction.date).toLocaleDateString();
            document.getElementById('receipt-donor-name').textContent = transaction.name;
            document.getElementById('receipt-donor-email').textContent = transaction.email;
            document.getElementById('receipt-donor-phone').textContent = transaction.contact;
            document.getElementById('receipt-donor-address').textContent = transaction.address;
            document.getElementById('receipt-amount').textContent = transaction.amount;
            document.getElementById('receipt-transaction-ref').textContent = transaction.paymentId;
            document.getElementById('download-receipt-btn').style.display = 'block';
        },
        validateForm: () => {
            // Add your donation form validation logic here
            return true;
        }
    });

    // Membership Form
    initializePaymentForm('membership-form', {
        membershipTypeSelectId: 'membership-type',
        nameInputId: 'member-name',
        emailInputId: 'member-email',
        phoneInputId: 'member-phone',
        photoInputId: 'member-photo',
        getAmountAndPurpose: () => {
            const membershipType = document.getElementById('membership-type').value;
            let amount = 0;
            let purpose = '';
            switch (membershipType) {
                case 'general':
                    amount = 1000;
                    purpose = 'General Membership';
                    break;
                case 'life':
                    amount = 10000;
                    purpose = 'Life Membership';
                    break;
                case 'patron':
                    amount = 50000;
                    purpose = 'Patron Membership';
                    break;
            }
            return { amount, purpose };
        },
        getPrefill: () => ({
            name: document.getElementById('member-name').value,
            email: document.getElementById('member-email').value,
            contact: document.getElementById('member-phone').value
        }),
        getNotes: () => ({}),
        onSuccess: (transaction) => {
            // Populate and show certificate/ID card download buttons
            const memberName = transaction.name;
            const membershipCategory = transaction.purpose;
            const memberId = 'NYNF-M-' + Date.now().toString().slice(-8);
            const issueDate = new Date(transaction.date).toLocaleDateString();
            const validUntil = transaction.purpose.includes('Life') || transaction.purpose.includes('Patron') ? 'Lifetime' : new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString();

            // Certificate
            document.getElementById('certificate-member-name').textContent = memberName;
            document.getElementById('certificate-membership-category').textContent = membershipCategory;
            document.getElementById('certificate-member-id').textContent = memberId;
            document.getElementById('certificate-issue-date').textContent = issueDate;
            document.getElementById('certificate-valid-until').textContent = validUntil;
            generateQRCode('certificate-qr-code', `Member ID: ${memberId}
Name: ${memberName}`);

            // ID Card
            document.getElementById('id-card-member-name').textContent = memberName;
            document.getElementById('id-card-member-id').textContent = memberId;
            document.getElementById('id-card-membership-category').textContent = membershipCategory;
            document.getElementById('id-card-issue-date').textContent = issueDate;
            document.getElementById('id-card-expiry-date').textContent = validUntil;
            generateQRCode('id-card-qr-code', `Member ID: ${memberId}
Name: ${memberName}`);

            const photoInput = document.getElementById('member-photo');
            if (photoInput.files && photoInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    document.getElementById('id-card-photo').src = e.target.result;
                }
                reader.readAsDataURL(photoInput.files[0]);
            }


            document.getElementById('download-certificate-btn').style.display = 'block';
            document.getElementById('download-id-card-btn').style.display = 'block';
        },
        validateForm: () => {
            // Add your membership form validation logic here
            return true;
        }
    });

    // Helper functions (showToast, saveTransaction, generateQRCode, etc.) should be available globally
    // or passed into the initializePaymentForm function.
});
