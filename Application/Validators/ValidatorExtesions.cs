using FluentValidation;

namespace Application.Validators
{
    public static class ValidatorExtesions
    {
        public static IRuleBuilder<T, string> Password<T> (this IRuleBuilder<T, string> ruleBuilder)
        {
            var options = ruleBuilder.NotEmpty()
                                     .MinimumLength(6)
                                     .WithMessage("É necessário uma senha com pelo menos 6 caracteres")
                                     .Matches("[A-Z]")
                                     .WithMessage("É necessário uma senha com pelo menos uma letra maiúscula")
                                     .Matches("[a-z]")
                                     .WithMessage("É necessário uma senha com pelo menos uma letra minúscula")
                                     .Matches("[0-9]")
                                     .WithMessage("É necessário uma senha com números")
                                     .Matches("[^a-zA-Z0-9]")
                                     .WithMessage("É necessário uma senha com caracteres não alfa numéricos");
            return options;

                                     

        }
    }
}