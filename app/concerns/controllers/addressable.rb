module Controllers::Addressable

  private

  def primary_address_params
    return {} unless params[:primary_address].present?
    params.require(:primary_address).permit(:address_line_one, :address_line_two, :city, :state_or_province, :postal_code)
  end

  def copy_to_address_params
    return {} unless params[:copy_to_address].present?
    params.require(:copy_to_address).permit(:address_line_one, :address_line_two, :city, :state_or_province, :postal_code)
  end

end
